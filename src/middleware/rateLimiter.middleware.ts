import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '@/infrastructure/cache/redis';
import { logger } from '@/observability/logger';

export const slidingWindowRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        // @ts-expect-error - Redis client type mismatch in some versions
        sendCommand: (...args: string[]) => redis.call(...args),
    }),
    handler: (req, res, _next, options) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`, { requestId: req.requestId });
        res.status(options.statusCode).json({ message: options.message });
    },
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 attempts per hour
    message: 'Too many authentication attempts, please try again after an hour',
    store: new RedisStore({
        // @ts-expect-error
        sendCommand: (...args: string[]) => redis.call(...args),
    }),
});
