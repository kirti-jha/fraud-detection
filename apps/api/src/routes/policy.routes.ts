import { Router } from 'express';
import { PolicyController } from '../controllers/policy.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate as any);
router.get('/', PolicyController.listVersions);
router.post('/simulate', PolicyController.simulateImpact);

export default router;
