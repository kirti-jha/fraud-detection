import { Router } from 'express';
import { RuleController } from '../controllers/rule.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate as any);

router.get('/', RuleController.list);
router.get('/:id', RuleController.getById);

// Admin-only rule modifications
router.post('/', authorize(['ADMIN']), RuleController.create);
router.patch('/:id', authorize(['ADMIN']), RuleController.update);

export default router;
