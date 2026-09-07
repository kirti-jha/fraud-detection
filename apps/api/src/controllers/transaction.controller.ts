import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TransactionService } from '../services/transaction.service';
import { RiskEngineService } from '../services/riskEngine.service';
import { ApiResponse } from '@fraudshield/shared-types';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const createTransactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  merchantId: z.string().optional(),
  amount: z.number().positive('Amount must be greater than 0'),
  currency: z.string().length(3).optional().default('INR'),
  deviceId: z.string().min(1, 'Device ID is required'),
  ipAddress: z.string().min(1, 'IP Address is required'),
  location: z.string().optional(),
  merchantCategory: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export class TransactionController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const idempotencyHeader = req.headers['x-idempotency-key'] as string;
      const body = createTransactionSchema.parse({
        ...req.body,
        merchantId: req.body.merchantId || (req as any).merchant?.id,
        idempotencyKey: req.body.idempotencyKey || idempotencyHeader,
      });

      // 1. Create Transaction Ledger record
      const transaction = await TransactionService.createTransaction(body);

      // 2. Perform Real-Time Risk Engine Scoring & Velocity Check
      const evaluation = await RiskEngineService.evaluateTransaction(transaction);

      // 3. Fetch updated transaction state
      const updatedTxn = await TransactionService.getTransactionById(transaction.id);

      const response: ApiResponse = {
        success: true,
        message: `Transaction evaluated with decision: ${updatedTxn.decision}`,
        data: {
          transaction: updatedTxn,
          evaluation,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const transaction = await TransactionService.getTransactionById(id);

      const response: ApiResponse = {
        success: true,
        data: transaction,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const userId = req.query.userId as string;
      const merchantId = req.query.merchantId as string;
      const status = req.query.status as string;
      const minRiskScore = req.query.minRiskScore ? parseInt(req.query.minRiskScore as string, 10) : undefined;
      const maxRiskScore = req.query.maxRiskScore ? parseInt(req.query.maxRiskScore as string, 10) : undefined;

      const result = await TransactionService.listTransactions({
        userId,
        merchantId,
        status,
        minRiskScore,
        maxRiskScore,
        page,
        limit,
      });

      const response: ApiResponse = {
        success: true,
        data: result.transactions,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
