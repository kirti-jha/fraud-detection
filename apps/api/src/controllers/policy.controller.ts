import { Request, Response, NextFunction } from 'express';
import { PolicyService } from '../services/policy.service';
import { ApiResponse } from '@fraudshield/shared-types';

export class PolicyController {
  static async listVersions(_req: Request, res: Response, next: NextFunction) {
    try {
      const versions = await PolicyService.listPolicyVersions();
      const response: ApiResponse = {
        success: true,
        data: versions,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async simulateImpact(req: Request, res: Response, next: NextFunction) {
    try {
      const threshold = req.body.threshold ? parseFloat(req.body.threshold) : 75000;
      const deviceWeight = req.body.deviceWeight ? parseInt(req.body.deviceWeight, 10) : 15;

      const result = await PolicyService.simulatePolicyImpact(threshold, deviceWeight);

      const response: ApiResponse = {
        success: true,
        data: result,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
