import 'reflect-metadata';
import { initTracing } from '@/observability/tracing';
initTracing(); // Must be first for auto-instrumentation
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
        const shutdown = async (signal: string) => {
            logger.info({ msg: `Received ${signal}, starting graceful shutdown` });

            const forceExit = setTimeout(() => {
                logger.error('Graceful shutdown timed out, forcing exit');
                process.exit(1);
            }, 10000);

            httpServer.close(async () => {
                logger.info('HTTP server closed');
                try {
                    await orderWorker.close();
                    logger.info('BullMQ worker closed');
                    // Add other workers here

                    await connectRedis(); // Ensure client exists before closing if needed, or use directly
                    // redis.disconnect() or .quit()

                    process.exit(0);
                } catch (err) {
                    logger.error('Error during shutdown', { err });
                    process.exit(1);
                } finally {
                    clearTimeout(forceExit);
                }
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (err) {
        logger.error('Failed to start server', { err });
        process.exit(1);
    }
};

start();
