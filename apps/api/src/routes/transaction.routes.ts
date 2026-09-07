import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authenticateApiKeyOrJwt } from '../middleware/apiKey.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Accept either Merchant API Key or User/Analyst JWT for transaction submission
router.post('/', authenticateApiKeyOrJwt as any, TransactionController.create as any);
router.get('/', authenticate as any, TransactionController.list as any);
router.get('/:id', authenticate as any, TransactionController.getById as any);

export default router;
