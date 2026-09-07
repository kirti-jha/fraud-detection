import { Router } from 'express';
import { BenchmarkController } from '../controllers/benchmark.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate as any);
router.post('/run', BenchmarkController.runBenchmark);

export default router;
