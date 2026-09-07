import { Router } from 'express';
import { ReplayController } from '../controllers/replay.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate as any);
router.get('/:transactionId', ReplayController.getReplay);

export default router;
