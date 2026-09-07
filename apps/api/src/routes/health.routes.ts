import { Router, Request, Response } from 'express';
import { checkDatabaseHealth } from '../config/database';
import { checkRedisHealth } from '../config/redis';
import { ApiResponse } from '@fraudshield/shared-types';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  const redisHealthy = await checkRedisHealth();

  const isHealthy = dbHealthy; // DB is primary requirement

  const response: ApiResponse = {
    success: isHealthy,
    message: isHealthy ? 'FraudShield API Service operational' : 'Degraded performance',
    data: {
      status: isHealthy ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'HEALTHY' : 'UNHEALTHY',
        redis: redisHealthy ? 'HEALTHY' : 'UNAVAILABLE',
      },
    },
  };

  res.status(isHealthy ? 200 : 503).json(response);
});

export default router;
