import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '@/middleware/validate.middleware';
import { authenticate } from '@/middleware/auth.middleware';
import { authLimiter } from '@/middleware/rateLimiter.middleware';
import { registerSchema, loginSchema, refreshSchema } from '../schemas/auth.schema';

const router = Router();
const controller = container.resolve(AuthController);

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', validate(refreshSchema), controller.refresh);
router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.getMe);

export default router;
