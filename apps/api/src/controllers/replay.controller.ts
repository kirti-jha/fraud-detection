import { Request, Response, NextFunction } from 'express';
import { ReplayService } from '../services/replay.service';
import { ApiResponse } from '@fraudshield/shared-types';

export class ReplayController {
  static async getReplay(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId } = req.params;
      const replay = await ReplayService.getDecisionReplay(transactionId);
      const response: ApiResponse = {
        success: true,
        data: replay,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
