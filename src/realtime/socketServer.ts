import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { env } from '../config/env';
import { logger } from '../observability/logger';
import { registerChatHandlers } from './chat.socket';

export class SocketServer {
    private static io: Server;

    static init(httpServer: HttpServer): Server {
        this.io = new Server(httpServer, {
            cors: {
                origin: env.CLIENT_URL,
                methods: ['GET', 'POST'],
            },
            pingTimeout: 60000,
        });

        this.io.on('connection', (socket: Socket) => {
            logger.info(`🔌 Socket connected: ${socket.id}`);

            registerChatHandlers(this.io, socket);

            socket.on('disconnect', () => {
                logger.info(`🔌 Socket disconnected: ${socket.id}`);
            });
        });

        logger.info('📡 Socket.io server initialized');
        return this.io;
    }

    static getIO(): Server {
        if (!this.io) {
            throw new Error('Socket.io not initialized');
        }
        return this.io;
    }
}
