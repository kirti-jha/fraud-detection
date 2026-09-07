import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Require FRAUD_ANALYST or ADMIN role for alert investigation
router.use(authenticate as any);
router.use(authorize(['ADMIN', 'FRAUD_ANALYST']));

router.get('/', AlertController.list);
router.get('/:id', AlertController.getById);
router.patch('/:id/status', AlertController.updateStatus as any);
router.post('/:id/notes', AlertController.addNote as any);

export default router;
