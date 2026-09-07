import { query } from '../config/database';
import { config } from '../config/env';
import { VelocityService } from './velocity.service';
import { PaymentProcessorService } from './paymentProcessor.service';
import {
  ITransaction,
  IRuleTrigger,
  RiskDecision,
  IRiskEvaluation,
  ISignalBreakdown,
  ILatencyBreakdown,
} from '@fraudshield/shared-types';

export class RiskEngineService {
  static async evaluateTransaction(transaction: ITransaction): Promise<IRiskEvaluation> {
    const totalStart = performance.now();
    const ruleTriggers: IRuleTrigger[] = [];
    const signalsBreakdown: ISignalBreakdown[] = [];

    let rulesStart = performance.now();
    let ruleScore = 0;

    // 1. Fetch active risk rules
    const rulesRes = await query('SELECT * FROM risk_rules WHERE is_active = TRUE');
    const activeRules = rulesRes.rows;

    // 2. Rule: HIGH_AMOUNT
    const highAmountRule = activeRules.find((r) => r.code === 'HIGH_AMOUNT');
    if (highAmountRule) {
      const threshold = highAmountRule.parameters?.threshold || 50000;
      if (transaction.amount > threshold) {
        const weight = highAmountRule.weight || 55;
        ruleScore += weight;
        const reason = `Transaction amount ₹${transaction.amount.toLocaleString()} exceeds threshold of ₹${threshold.toLocaleString()}`;
        ruleTriggers.push({
          ruleCode: 'HIGH_AMOUNT',
          ruleName: highAmountRule.name,
          category: 'AMOUNT',
          weight,
          reason,
        });
        signalsBreakdown.push({
          code: 'HIGH_AMOUNT',
          name: highAmountRule.name,
          category: 'AMOUNT',
          weight,
          reason,
          type: 'RULE',
        });
      }
    }

    // 3. Rule & Device Check: NEW_DEVICE
    let isNewDevice = 0;
    const newDeviceRule = activeRules.find((r) => r.code === 'NEW_DEVICE');
    if (newDeviceRule) {
      const deviceRes = await query(
        'SELECT id FROM user_devices WHERE user_id = $1 AND device_fingerprint = $2',
        [transaction.userId, transaction.deviceId]
      );

      if (deviceRes.rows.length === 0) {
        isNewDevice = 1;
        const weight = newDeviceRule.weight || 45;
        ruleScore += weight;
        const reason = `Device fingerprint '${transaction.deviceId}' is not registered in user history`;
        ruleTriggers.push({
          ruleCode: 'NEW_DEVICE',
          ruleName: newDeviceRule.name,
          category: 'DEVICE',
          weight,
          reason,
        });
        signalsBreakdown.push({
          code: 'NEW_DEVICE',
          name: newDeviceRule.name,
          category: 'DEVICE',
          weight,
          reason,
          type: 'RULE',
        });

        // Register new device
        await query(
          `INSERT INTO user_devices (user_id, device_fingerprint, ip_address, location_city)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id, device_fingerprint)
           DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP`,
          [transaction.userId, transaction.deviceId, transaction.ipAddress, transaction.location || 'Unknown']
        );
      } else {
        await query(
          'UPDATE user_devices SET last_seen_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND device_fingerprint = $2',
          [transaction.userId, transaction.deviceId]
        );
      }
    }

    // 5. Rule: AMOUNT_SPIKE vs Historical User Average
    let amountRatio = 1.0;
    const amountSpikeRule = activeRules.find((r) => r.code === 'AMOUNT_SPIKE');
    if (amountSpikeRule) {
      const avgRes = await query(
        'SELECT AVG(amount) as avg_amount FROM transactions WHERE user_id = $1 AND status != \'BLOCKED\'',
        [transaction.userId]
      );
      const avgAmount = parseFloat(avgRes.rows[0]?.avg_amount || '0');
      const multiplier = amountSpikeRule.parameters?.multiplier || 5;

      if (avgAmount > 0) {
        amountRatio = transaction.amount / avgAmount;
        if (transaction.amount >= avgAmount * multiplier) {
          const weight = amountSpikeRule.weight || 20;
          ruleScore += weight;
          const reason = `Transaction amount ₹${transaction.amount} is ${Math.round(amountRatio)}x higher than average history (₹${Math.round(avgAmount)})`;
          ruleTriggers.push({
            ruleCode: 'AMOUNT_SPIKE',
            ruleName: amountSpikeRule.name,
            category: 'BEHAVIOR',
            weight,
            reason,
          });
          signalsBreakdown.push({
            code: 'AMOUNT_SPIKE',
            name: amountSpikeRule.name,
            category: 'BEHAVIOR',
            weight,
            reason,
            type: 'BEHAVIOR',
          });
        }
      }
    }

    const rulesMs = Number((performance.now() - rulesStart).toFixed(2));

    // 4. Redis Velocity Check: HIGH_VELOCITY_5M
    const redisStart = performance.now();
    const velocityRule = activeRules.find((r) => r.code === 'HIGH_VELOCITY_5M');
    let velocityMetrics = { count: 1, totalAmount: transaction.amount };
    if (velocityRule) {
      const windowSec = velocityRule.parameters?.windowSeconds || 300;
      const maxCount = velocityRule.parameters?.maxCount || 5;

      velocityMetrics = await VelocityService.recordAndCheckVelocity(
        transaction.userId,
        transaction.amount,
        windowSec
      );

      if (velocityMetrics.count > maxCount) {
        const weight = velocityRule.weight || 30;
        ruleScore += weight;
        const reason = `High velocity anomaly: ${velocityMetrics.count} transactions in 5 minutes (max allowed: ${maxCount})`;
        ruleTriggers.push({
          ruleCode: 'HIGH_VELOCITY_5M',
          ruleName: velocityRule.name,
          category: 'VELOCITY',
          weight,
          reason,
        });
        signalsBreakdown.push({
          code: 'HIGH_VELOCITY_5M',
          name: velocityRule.name,
          category: 'VELOCITY',
          weight,
          reason,
          type: 'VELOCITY',
        });
      }
    }
    const redisMs = Number((performance.now() - redisStart).toFixed(2));

    // 6. Invoke Python ML Microservice for Probability Prediction
    const mlStart = performance.now();
    let mlProbability = 0.05;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);

      const mlResponse = await fetch(`${config.mlService.url}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          transaction_id: transaction.id,
          amount: Number(transaction.amount),
          is_new_device: isNewDevice,
          is_new_location: 0,
          velocity_5m: velocityMetrics.count,
          amount_ratio: amountRatio,
        }),
      });

      clearTimeout(timeoutId);

      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        mlProbability = mlData.fraud_probability || 0.05;
      }
    } catch (err) {
      mlProbability = ruleScore > 50 ? 0.75 : 0.05;
    }
    const mlMs = Number((performance.now() - mlStart).toFixed(2));

    const mlContribution = Math.round(mlProbability * 100);
    if (mlContribution > 30) {
      signalsBreakdown.push({
        code: 'ML_MODEL_PROBABILITY',
        name: 'Python ML Fraud Probability Predictor',
        category: 'BEHAVIOR',
        weight: Math.round(mlContribution * 0.4),
        reason: `Machine Learning model predicts high fraud probability (${(mlProbability * 100).toFixed(1)}%)`,
        type: 'ML',
      });
    }

    // 7. Compute Ensemble Score (60% Rule Weight + 40% ML Probability)
    const ensembleScore = Math.min(100, Math.round(0.6 * ruleScore + 0.4 * (mlProbability * 100)));
    
    let decision: RiskDecision = 'APPROVE';
    let status = 'APPROVED';

    if (ensembleScore >= 71) {
      decision = 'BLOCK';
      status = 'BLOCKED';
    } else if (ensembleScore >= 31) {
      decision = 'REVIEW';
      status = 'REVIEW';
    }

    // 8. Update Transaction Ledger & Record Evaluation
    const dbStart = performance.now();

    await query(
      `UPDATE transactions 
       SET risk_score = $1, decision = $2, status = $3 
       WHERE id = $4`,
      [ensembleScore, decision, status, transaction.id]
    );

    // Transition Mock Payment Settlement Rails
    const mockPayment = await PaymentProcessorService.processPaymentGatewayRails(transaction.id, decision);

    const dbMs = Number((performance.now() - dbStart).toFixed(2));
    const totalMs = Number((performance.now() - totalStart).toFixed(2));

    const latencyBreakdown: ILatencyBreakdown = {
      rulesMs,
      redisMs,
      mlMs,
      dbMs,
      totalMs,
    };

    const evalRes = await query(
      `INSERT INTO risk_evaluations (
        transaction_id, overall_score, decision, rule_triggers, signals_breakdown, latency_breakdown, velocity_signals, ml_score
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, transaction_id as "transactionId", overall_score as "overallScore",
                decision, rule_triggers as "ruleTriggers", signals_breakdown as "signalsBreakdown",
                latency_breakdown as "latencyBreakdown", velocity_signals as "velocitySignals",
                ml_score as "mlScore", evaluated_at as "evaluatedAt"`,
      [
        transaction.id,
        ensembleScore,
        decision,
        JSON.stringify(ruleTriggers),
        JSON.stringify(signalsBreakdown),
        JSON.stringify(latencyBreakdown),
        JSON.stringify(velocityMetrics),
        mlProbability,
      ]
    );

    // 9. Dispatch Alert for Fraud Analysts if decision is REVIEW or BLOCK
    if (decision === 'REVIEW' || decision === 'BLOCK') {
      const severity = ensembleScore >= 85 ? 'CRITICAL' : ensembleScore >= 71 ? 'HIGH' : 'MEDIUM';
      const alertRef = `ALT_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

      await query(
        `INSERT INTO alerts (alert_ref, transaction_id, risk_score, severity, status)
         VALUES ($1, $2, $3, $4, 'OPEN')
         ON CONFLICT (alert_ref) DO NOTHING`,
        [alertRef, transaction.id, ensembleScore, severity]
      );
    }

    return evalRes.rows[0];
  }
}
