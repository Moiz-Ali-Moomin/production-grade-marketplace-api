import 'reflect-metadata';
import { httpServer } from '@/app';
import { env } from '@/config/env';
import { connectDatabase } from '@/infrastructure/database/prisma';
import { connectRedis } from '@/infrastructure/cache/redis';
import { logger } from '@/observability/logger';
import { initEventHandlers } from '@/events/handlers';
import { orderWorker } from '@/workers/order.worker';

const start = async () => {
    try {
        // Connect to infrastructure
        await connectDatabase();
        await connectRedis();

        // Initialize Domain Events
        initEventHandlers();

        // Ensure worker is active
        logger.info(`[Worker] ${orderWorker.constructor.name} initialized`);

        // Start server
        const port = env.PORT;
        httpServer.listen(port, () => {
            logger.info({
                msg: '🚀 Server started successfully',
                port,
                env: env.NODE_ENV,
                version: env.API_VERSION,
            });
            logger.info('📡 Socket.io ready');
        });

        // Handle graceful shutdown
        const shutdown = async () => {
            logger.info('Shutting down server...');
            httpServer.close(async () => {
                logger.info('HTTP server closed');
                // Potential disconnect calls for prisma/redis if needed
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (err) {
        logger.error('Failed to start server', { err });
        process.exit(1);
    }
};

start();
