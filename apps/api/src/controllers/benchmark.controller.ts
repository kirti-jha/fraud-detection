import { Request, Response, NextFunction } from 'express';
import { BenchmarkService } from '../services/benchmark.service';
import { ApiResponse } from '@fraudshield/shared-types';

export class BenchmarkController {
  static async runBenchmark(req: Request, res: Response, next: NextFunction) {
    try {
      const totalRequests = req.body.totalRequests ? parseInt(req.body.totalRequests, 10) : 50;
      const concurrency = req.body.concurrency ? parseInt(req.body.concurrency, 10) : 5;

      const report = await BenchmarkService.runLoadBenchmark(totalRequests, concurrency);

      const response: ApiResponse = {
        success: true,
        message: 'Benchmark load test executed successfully',
        data: report,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
