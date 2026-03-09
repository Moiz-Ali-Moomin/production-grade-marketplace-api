import { Router } from 'express';
import { authRoutes } from '@/modules/auth';
import { productRoutes } from '@/modules/product';
import { orderRoutes } from '@/modules/order';
import { chatRoutes } from '@/modules/chat';
import { sellerRoutes } from '@/modules/seller';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/chat', chatRoutes);
router.use('/seller', sellerRoutes);

export { router as v1Router };
