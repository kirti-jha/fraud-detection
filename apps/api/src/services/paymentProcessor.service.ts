import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { MockPaymentStatus, RiskDecision } from '@fraudshield/shared-types';

export class PaymentProcessorService {
  static async processPaymentGatewayRails(
    transactionId: string,
    decision: RiskDecision
  ): Promise<{ paymentStatus: MockPaymentStatus; settlementRef: string }> {
    let paymentStatus: MockPaymentStatus = 'PAYMENT_PROCESSING';
    const settlementRef = `PAY_SETTLE_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    if (decision === 'APPROVE') {
      paymentStatus = 'PAYMENT_SUCCESS';
    } else if (decision === 'BLOCK') {
      paymentStatus = 'PAYMENT_REJECTED';
    } else if (decision === 'REVIEW') {
      paymentStatus = 'PAYMENT_HELD_FOR_REVIEW';
    }

    await query(
      `UPDATE transactions 
       SET payment_status = $1 
       WHERE id = $2`,
      [paymentStatus, transactionId]
    );

    return { paymentStatus, settlementRef };
  }
}
