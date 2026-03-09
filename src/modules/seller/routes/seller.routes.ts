import { Router } from 'express';
import { container } from 'tsyringe';
import { SellerController } from '../controllers/seller.controller';
import { authenticate, requireRole } from '@/middleware/auth.middleware';

const router = Router();
const controller = container.resolve(SellerController);

router.use(authenticate as any, requireRole('SELLER') as any);

router.post('/onboard', controller.onboardSeller);
router.get('/dashboard', controller.getDashboard);

export default router;
