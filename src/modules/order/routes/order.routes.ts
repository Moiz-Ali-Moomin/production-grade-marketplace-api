import { Router } from 'express';
import { container } from 'tsyringe';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '@/middleware/auth.middleware';

const router = Router();
const controller = container.resolve(OrderController);

router.use(authenticate);

router.post('/', controller.createOrder);
router.get('/my', controller.getMyOrders);

export default router;
