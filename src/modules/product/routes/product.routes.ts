import { Router } from 'express';
import { container } from 'tsyringe';
import { ProductController } from '../controllers/product.controller';
import { authenticate } from '@/middleware/auth.middleware';

const router = Router();
const controller = container.resolve(ProductController);

// Public routes
router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);

// Protected routes
router.post('/', authenticate, controller.createProduct);
router.put('/:id', authenticate, controller.updateProduct);
router.delete('/:id', authenticate, controller.deleteProduct);

export default router;
