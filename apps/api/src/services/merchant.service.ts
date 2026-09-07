import crypto from 'crypto';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface IMerchant {
  id: string;
  name: string;
  apiKeyHash: string;
  category: string;
  status: string;
  createdAt: string;
}

export class MerchantService {
  static hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  static async generateMerchantApiKey(name: string, category: string): Promise<{ merchant: IMerchant; rawApiKey: string }> {
    const rawApiKey = `fs_live_${crypto.randomBytes(24).toString('hex')}`;
    const apiKeyHash = this.hashApiKey(rawApiKey);

    const result = await query(
      `INSERT INTO merchants (name, api_key_hash, category)
       VALUES ($1, $2, $3)
       RETURNING id, name, api_key_hash as "apiKeyHash", category, status, created_at as "createdAt"`,
      [name, apiKeyHash, category]
    );

    return {
      merchant: result.rows[0],
      rawApiKey,
    };
  }

  static async validateApiKey(rawApiKey: string): Promise<IMerchant> {
    const hash = this.hashApiKey(rawApiKey);
    const result = await query(
      `SELECT id, name, api_key_hash as "apiKeyHash", category, status, created_at as "createdAt"
       FROM merchants WHERE api_key_hash = $1 AND status = 'ACTIVE'`,
      [hash]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid or inactive Merchant API Key', 401);
    }

    return result.rows[0];
  }
}
