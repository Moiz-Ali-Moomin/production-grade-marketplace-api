import { Request, Response } from 'express';
import { prisma } from '@/infrastructure/database/prisma';
import { redis } from '@/infrastructure/cache/redis';
import { logger } from './logger';

export const healthCheckHandler = async (_req: Request, res: Response) => {
    const healthStatus: any = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        services: {},
    };

    try {
        // Database check
        await prisma.$queryRaw`SELECT 1`;
        healthStatus.services.database = { status: 'UP' };
    } catch (error) {
        logger.error('Health check: Database failed', { error });
        healthStatus.status = 'DEGRADED';
        healthStatus.services.database = { status: 'DOWN' };
    }

    try {
        // Redis check
        await redis.ping();
        healthStatus.services.redis = { status: 'UP' };
    } catch (error) {
        logger.error('Health check: Redis failed', { error });
        healthStatus.status = 'DEGRADED';
        healthStatus.services.redis = { status: 'DOWN' };
    }

    const statusCode = healthStatus.status === 'UP' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
};
