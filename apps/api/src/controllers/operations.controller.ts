import { Request, Response, NextFunction } from 'express';
import { OperationsService } from '../services/operations.service';
import { ApiResponse } from '@fraudshield/shared-types';

export class OperationsController {
  static async getHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const health = await OperationsService.getSystemOperationsHealth();
      const response: ApiResponse = {
        success: true,
        data: health,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
