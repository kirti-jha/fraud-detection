import { Request, Response, NextFunction } from 'express';
import { IntelligenceService } from '../services/intelligence.service';
import { ApiResponse } from '@fraudshield/shared-types';

export class IntelligenceController {
  static async getMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await IntelligenceService.getRiskIntelligence();
      const response: ApiResponse = {
        success: true,
        data: metrics,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
