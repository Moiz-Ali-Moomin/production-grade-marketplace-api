import Redis from 'ioredis';
import { env } from '../../config/env';
import { logger } from '../../observability/logger';

export const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redis.on('connect', () => logger.info('🚀 Redis connected successfully'));
redis.on('error', (error) => logger.error('❌ Redis connection error', { error }));

export const connectRedis = async () => {
    if (redis.status === 'ready') return;
    await redis.connect().catch(() => { });
};
