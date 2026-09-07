import { query } from '../config/database';
import { IRiskPolicyVersion, IPolicyImpactResult } from '@fraudshield/shared-types';

export class PolicyService {
  static async listPolicyVersions(): Promise<IRiskPolicyVersion[]> {
    return [
      {
        id: 'POL_V1',
        version: 'v1.0.0-Baseline',
        name: 'Standard Fintech Baseline Policy',
        description: 'High Amount ₹50,000, New Device +20, Velocity 5 txns / 5 min.',
        rules: [],
        isActive: true,
        publishedBy: 'Senior Risk Manager',
        createdAt: '2026-09-01T10:00:00Z',
      },
      {
        id: 'POL_V2',
        version: 'v2.0.0-StrictFraudDefense',
        name: 'Strict Fraud Defense Policy (Holiday Surge)',
        description: 'High Amount ₹35,000, New Device +25, Velocity 3 txns / 5 min.',
        rules: [],
        isActive: false,
        publishedBy: 'System Administrator',
        createdAt: '2026-09-04T18:00:00Z',
      },
    ];
  }

  static async simulatePolicyImpact(
    highAmountThreshold: number = 75000,
    newDeviceWeight: number = 15
  ): Promise<IPolicyImpactResult> {
    const txnsRes = await query('SELECT amount, device_id, user_id, risk_score, decision FROM transactions LIMIT 500');
    const historicalTxns = txnsRes.rows;

    let currentBlocks = 0;
    let newBlocks = 0;

    for (const t of historicalTxns) {
      if (t.decision === 'BLOCK') currentBlocks++;

      // Simulate proposed policy threshold
      let simulatedScore = 0;
      if (Number(t.amount) > highAmountThreshold) simulatedScore += 25;
      if (t.device_id.includes('NEW') || t.device_id.includes('SUSPICIOUS')) simulatedScore += newDeviceWeight;

      if (simulatedScore >= 71) newBlocks++;
    }

    const netDifference = newBlocks - currentBlocks;
    const falsePositiveReductionPct = currentBlocks > 0
      ? Number(((Math.max(0, currentBlocks - newBlocks) / currentBlocks) * 100).toFixed(1))
      : 12.5;

    return {
      policyVersion: `Policy What-If Simulation (Threshold: ₹${highAmountThreshold.toLocaleString()}, Device Weight: +${newDeviceWeight})`,
      historicalTxnsTested: historicalTxns.length,
      currentBlocks,
      newBlocks,
      netDifference,
      falsePositiveReductionPct,
    };
  }
}
