import { Server, Socket } from 'socket.io';
import { container } from 'tsyringe';
import { ChatService } from '@/modules/chat';
import { logger } from '@/observability/logger';

export const registerChatHandlers = (io: Server, socket: Socket) => {
    const chatService = container.resolve(ChatService);

    socket.on('join_room', (roomId: string) => {
        socket.join(roomId);
        logger.info(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('send_message', async (data: { roomId: string; senderId: string; content: string }) => {
        try {
            const { roomId, senderId, content } = data;
            const message = await chatService.saveMessage(roomId, senderId, content);

            io.to(roomId).emit('new_message', message);
        } catch (error) {
            logger.error('Socket message error', { error });
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    socket.on('leave_room', (roomId: string) => {
        socket.leave(roomId);
        logger.info(`User ${socket.id} left room ${roomId}`);
    });
};
