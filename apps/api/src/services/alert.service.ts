import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { IAlert, AlertStatus, IInvestigationNote } from '@fraudshield/shared-types';

export class AlertService {
  static async listAlerts(filters: {
    status?: AlertStatus;
    severity?: string;
    assignedToId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ alerts: IAlert[]; total: number; page: number; limit: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? Math.min(filters.limit, 100) : 20;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: any[] = [];

    if (filters.status) {
      values.push(filters.status);
      conditions.push(`a.status = $${values.length}`);
    }
    if (filters.severity) {
      values.push(filters.severity);
      conditions.push(`a.severity = $${values.length}`);
    }
    if (filters.assignedToId) {
      values.push(filters.assignedToId);
      conditions.push(`a.assigned_to_id = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await query(`SELECT COUNT(*) as total FROM alerts a ${whereClause}`, values);
    const total = parseInt(countRes.rows[0].total, 10);

    values.push(limit);
    values.push(offset);
    const queryText = `
      SELECT a.id, a.alert_ref as "alertRef", a.transaction_id as "transactionId",
             a.risk_score as "riskScore", a.severity, a.status,
             a.assigned_to_id as "assignedToId", u.full_name as "assignedToName",
             a.created_at as "createdAt", a.updated_at as "updatedAt",
             t.transaction_ref as "transactionRef", t.amount, t.currency, t.user_id as "userId",
             t.device_id as "deviceId", t.location
      FROM alerts a
      LEFT JOIN users u ON a.assigned_to_id = u.id
      JOIN transactions t ON a.transaction_id = t.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await query(queryText, values);

    return {
      alerts: result.rows,
      total,
      page,
      limit,
    };
  }

  static async getAlertDetail(id: string): Promise<IAlert> {
    const alertRes = await query(
      `SELECT a.id, a.alert_ref as "alertRef", a.transaction_id as "transactionId",
              a.risk_score as "riskScore", a.severity, a.status,
              a.assigned_to_id as "assignedToId", u.full_name as "assignedToName",
              a.created_at as "createdAt", a.updated_at as "updatedAt"
       FROM alerts a
       LEFT JOIN users u ON a.assigned_to_id = u.id
       WHERE a.id = $1 OR a.alert_ref = $1`,
      [id]
    );

    if (alertRes.rows.length === 0) {
      throw new AppError('Alert case not found', 404);
    }

    const alert = alertRes.rows[0];

    // Transaction & Risk Evaluation detail
    const txnRes = await query(
      `SELECT id, transaction_ref as "transactionRef", user_id as "userId",
              merchant_id as "merchantId", amount, currency, device_id as "deviceId",
              ip_address as "ipAddress", location, merchant_category as "merchantCategory",
              status, risk_score as "riskScore", decision, created_at as "createdAt"
       FROM transactions WHERE id = $1`,
      [alert.transactionId]
    );
    alert.transaction = txnRes.rows[0];

    const evalRes = await query(
      `SELECT id, transaction_id as "transactionId", overall_score as "overallScore",
              decision, rule_triggers as "ruleTriggers", velocity_signals as "velocitySignals",
              ml_score as "mlScore", evaluated_at as "evaluatedAt"
       FROM risk_evaluations WHERE transaction_id = $1 ORDER BY evaluated_at DESC LIMIT 1`,
      [alert.transactionId]
    );
    alert.evaluation = evalRes.rows[0];

    // Investigation notes
    const notesRes = await query(
      `SELECT n.id, n.alert_id as "alertId", n.analyst_id as "analystId",
              u.full_name as "analystName", n.note, n.created_at as "createdAt"
       FROM investigation_notes n
       JOIN users u ON n.analyst_id = u.id
       WHERE n.alert_id = $1
       ORDER BY n.created_at ASC`,
      [alert.id]
    );
    alert.notes = notesRes.rows;

    return alert;
  }

  static async updateAlertStatus(
    id: string,
    status: AlertStatus,
    analystId?: string
  ): Promise<IAlert> {
    const alertRes = await query('SELECT id, status FROM alerts WHERE id = $1 OR alert_ref = $1', [id]);
    if (alertRes.rows.length === 0) {
      throw new AppError('Alert not found', 404);
    }

    const alertId = alertRes.rows[0].id;

    await query(
      `UPDATE alerts
       SET status = $1, assigned_to_id = COALESCE($2, assigned_to_id), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [status, analystId || null, alertId]
    );

    // Audit trail record
    await query(
      `INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, 'ALERT', $3, $4)`,
      [analystId || null, 'ALERT_STATUS_UPDATE', alertId, JSON.stringify({ previousStatus: alertRes.rows[0].status, newStatus: status })]
    );

    return this.getAlertDetail(alertId);
  }

  static async addNote(
    alertId: string,
    analystId: string,
    noteText: string
  ): Promise<IInvestigationNote> {
    const alertRes = await query('SELECT id FROM alerts WHERE id = $1 OR alert_ref = $1', [alertId]);
    if (alertRes.rows.length === 0) {
      throw new AppError('Alert not found', 404);
    }

    const targetAlertId = alertRes.rows[0].id;

    const result = await query(
      `INSERT INTO investigation_notes (alert_id, analyst_id, note)
       VALUES ($1, $2, $3)
       RETURNING id, alert_id as "alertId", analyst_id as "analystId", note, created_at as "createdAt"`,
      [targetAlertId, analystId, noteText]
    );

    const note = result.rows[0];

    const analystRes = await query('SELECT full_name FROM users WHERE id = $1', [analystId]);
    note.analystName = analystRes.rows[0]?.full_name || 'Fraud Analyst';

    return note;
  }
}
