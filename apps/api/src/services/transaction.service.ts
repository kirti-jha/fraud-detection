import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { ITransaction, ICreateTransactionInput } from '@fraudshield/shared-types';

export class TransactionService {
  static async createTransaction(input: ICreateTransactionInput): Promise<ITransaction> {
    const { userId, merchantId, amount, currency = 'INR', deviceId, ipAddress, location, merchantCategory, idempotencyKey } = input;

    // 1. Idempotency Check
    if (idempotencyKey) {
      const existing = await query(
        `SELECT id, transaction_ref as "transactionRef", idempotency_key as "idempotencyKey",
                merchant_id as "merchantId", user_id as "userId", amount, currency,
                device_id as "deviceId", ip_address as "ipAddress", location,
                merchant_category as "merchantCategory", status, risk_score as "riskScore",
                decision, created_at as "createdAt"
         FROM transactions WHERE idempotency_key = $1`,
        [idempotencyKey]
      );

      if (existing.rows.length > 0) {
        return existing.rows[0];
      }
    }

    // 2. Generate unique reference ID
    const transactionRef = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Insert transaction ledger entry
    const result = await query(
      `INSERT INTO transactions (
        transaction_ref, idempotency_key, merchant_id, user_id, amount, currency,
        device_id, ip_address, location, merchant_category, status, risk_score
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'RECEIVED', 0)
      RETURNING id, transaction_ref as "transactionRef", idempotency_key as "idempotencyKey",
                merchant_id as "merchantId", user_id as "userId", amount, currency,
                device_id as "deviceId", ip_address as "ipAddress", location,
                merchant_category as "merchantCategory", status, risk_score as "riskScore",
                decision, created_at as "createdAt"`,
      [
        transactionRef,
        idempotencyKey || null,
        merchantId || null,
        userId,
        amount,
        currency,
        deviceId,
        ipAddress,
        location || null,
        merchantCategory || null,
      ]
    );

    return result.rows[0];
  }

  static async getTransactionById(id: string): Promise<ITransaction> {
    const result = await query(
      `SELECT id, transaction_ref as "transactionRef", idempotency_key as "idempotencyKey",
              merchant_id as "merchantId", user_id as "userId", amount, currency,
              device_id as "deviceId", ip_address as "ipAddress", location,
              merchant_category as "merchantCategory", status, risk_score as "riskScore",
              decision, created_at as "createdAt"
       FROM transactions WHERE id = $1 OR transaction_ref = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Transaction not found', 404);
    }

    return result.rows[0];
  }

  static async listTransactions(filters: {
    userId?: string;
    merchantId?: string;
    status?: string;
    minRiskScore?: number;
    maxRiskScore?: number;
    page?: number;
    limit?: number;
  }): Promise<{ transactions: ITransaction[]; total: number; page: number; limit: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? Math.min(filters.limit, 100) : 20;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: any[] = [];

    if (filters.userId) {
      values.push(filters.userId);
      conditions.push(`user_id = $${values.length}`);
    }
    if (filters.merchantId) {
      values.push(filters.merchantId);
      conditions.push(`merchant_id = $${values.length}`);
    }
    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }
    if (filters.minRiskScore !== undefined) {
      values.push(filters.minRiskScore);
      conditions.push(`risk_score >= $${values.length}`);
    }
    if (filters.maxRiskScore !== undefined) {
      values.push(filters.maxRiskScore);
      conditions.push(`risk_score <= $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query(`SELECT COUNT(*) as total FROM transactions ${whereClause}`, values);
    const total = parseInt(countResult.rows[0].total, 10);

    values.push(limit);
    values.push(offset);
    const queryText = `
      SELECT id, transaction_ref as "transactionRef", idempotency_key as "idempotencyKey",
             merchant_id as "merchantId", user_id as "userId", amount, currency,
             device_id as "deviceId", ip_address as "ipAddress", location,
             merchant_category as "merchantCategory", status, risk_score as "riskScore",
             decision, created_at as "createdAt"
      FROM transactions
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await query(queryText, values);

    return {
      transactions: result.rows,
      total,
      page,
      limit,
    };
  }
}
