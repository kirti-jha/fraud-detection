import { Router } from 'express';
import { IntelligenceController } from '../controllers/intelligence.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate as any);
router.get('/', IntelligenceController.getMetrics);

export default router;
