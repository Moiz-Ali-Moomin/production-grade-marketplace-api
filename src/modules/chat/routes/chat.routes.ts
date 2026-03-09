import { Router } from 'express';
import { container } from 'tsyringe';
import { ChatController } from '../controllers/chat.controller';
import { authenticate } from '@/middleware/auth.middleware';

const router = Router();
const controller = container.resolve(ChatController);

router.get('/', authenticate as any, controller.getMyChatRooms);
router.get('/:roomId/messages', authenticate as any, controller.getMessages);

export default router;
