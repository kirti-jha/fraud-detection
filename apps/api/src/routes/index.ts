import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import transactionRoutes from './transaction.routes';
import alertRoutes from './alert.routes';
import ruleRoutes from './rule.routes';
import replayRoutes from './replay.routes';
import intelligenceRoutes from './intelligence.routes';
import benchmarkRoutes from './benchmark.routes';
import policyRoutes from './policy.routes';
import operationsRoutes from './operations.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/alerts', alertRoutes);
router.use('/rules', ruleRoutes);
router.use('/replay', replayRoutes);
router.use('/intelligence', intelligenceRoutes);
router.use('/benchmark', benchmarkRoutes);
router.use('/policies', policyRoutes);
router.use('/operations', operationsRoutes);

export default router;
