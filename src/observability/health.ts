import { Request, Response } from 'express';
import { prisma } from '@/infrastructure/database/prisma';
import { redis } from '@/infrastructure/cache/redis';

export const healthCheckHandler = async (_req: Request, res: Response) => {
    const healthStatus: any = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        services: {},
    };

    const tasks = [
        // Database check
        (async () => {
            try {
                await prisma.$queryRaw`SELECT 1`;
                healthStatus.services.database = { status: 'UP', latency: 'ms' };
            } catch (error) {
                healthStatus.status = 'DEGRADED';
                healthStatus.services.database = { status: 'DOWN', error: (error as Error).message };
            }
        })(),

        // Redis check
        (async () => {
            try {
                const start = Date.now();
                await redis.ping();
                healthStatus.services.redis = { status: 'UP', latency: `${Date.now() - start}ms` };
            } catch (error) {
                healthStatus.status = 'DEGRADED';
                healthStatus.services.redis = { status: 'DOWN', error: (error as Error).message };
            }
        })(),

        // Worker Queue check
        (async () => {
            try {
                // Just checking connectivity to the worker backend
                const client = await redis.info();
                healthStatus.services.workers = { status: client ? 'UP' : 'DOWN' };
            } catch (error) {
                healthStatus.services.workers = { status: 'DOWN' };
            }
        })()
    ];

    await Promise.all(tasks);

    const statusCode = healthStatus.status === 'UP' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
};
