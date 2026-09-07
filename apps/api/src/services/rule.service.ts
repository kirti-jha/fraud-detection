import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { IRiskRule, RuleCategory } from '@fraudshield/shared-types';

export class RuleService {
  static async listRules(): Promise<IRiskRule[]> {
    const result = await query(
      `SELECT id, code, name, description, category, weight, parameters, is_active as "isActive", created_at as "createdAt"
       FROM risk_rules
       ORDER BY weight DESC, name ASC`
    );
    return result.rows;
  }

  static async getRuleById(id: string): Promise<IRiskRule> {
    const result = await query(
      `SELECT id, code, name, description, category, weight, parameters, is_active as "isActive", created_at as "createdAt"
       FROM risk_rules
       WHERE id = $1 OR code = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Risk rule not found', 404);
    }

    return result.rows[0];
  }

  static async createRule(ruleData: {
    code: string;
    name: string;
    description: string;
    category: RuleCategory;
    weight: number;
    parameters?: Record<string, any>;
  }): Promise<IRiskRule> {
    const existing = await query('SELECT id FROM risk_rules WHERE code = $1', [ruleData.code]);
    if (existing.rows.length > 0) {
      throw new AppError('Rule with this code already exists', 400);
    }

    const result = await query(
      `INSERT INTO risk_rules (code, name, description, category, weight, parameters)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, code, name, description, category, weight, parameters, is_active as "isActive", created_at as "createdAt"`,
      [
        ruleData.code,
        ruleData.name,
        ruleData.description,
        ruleData.category,
        ruleData.weight,
        JSON.stringify(ruleData.parameters || {}),
      ]
    );

    return result.rows[0];
  }

  static async updateRule(
    id: string,
    updates: {
      name?: string;
      description?: string;
      weight?: number;
      parameters?: Record<string, any>;
      isActive?: boolean;
    }
  ): Promise<IRiskRule> {
    const rule = await this.getRuleById(id);

    const newName = updates.name !== undefined ? updates.name : rule.name;
    const newDesc = updates.description !== undefined ? updates.description : rule.description;
    const newWeight = updates.weight !== undefined ? updates.weight : rule.weight;
    const newParams = updates.parameters !== undefined ? JSON.stringify(updates.parameters) : JSON.stringify(rule.parameters);
    const newActive = updates.isActive !== undefined ? updates.isActive : rule.isActive;

    const result = await query(
      `UPDATE risk_rules
       SET name = $1, description = $2, weight = $3, parameters = $4, is_active = $5
       WHERE id = $6
       RETURNING id, code, name, description, category, weight, parameters, is_active as "isActive", created_at as "createdAt"`,
      [newName, newDesc, newWeight, newParams, newActive, rule.id]
    );

    return result.rows[0];
  }
}
