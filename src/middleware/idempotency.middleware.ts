import { Request, Response, NextFunction } from 'express';
import { IdempotencyStore } from '@/infrastructure/idempotency/idempotency.store';
import { logger } from '@/observability/logger';
import crypto from 'crypto';

export const idempotencyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Only apply to mutation methods
    if (!['POST', 'PATCH', 'DELETE'].includes(req.method)) {
        return next();
    }

    const key = req.headers['idempotency-key'] as string;
    if (!key) {
        return next();
    }

    // Create a fingerprint of the request to ensure the key isn't reused for different data
    const requestFingerprint = crypto
        .createHash('sha256')
        .update(JSON.stringify(req.body) + req.path + req.requestId)
        .digest('hex');

    const storageKey = `${key}:${requestFingerprint}`;

    try {
        const existing = await IdempotencyStore.get(storageKey);
        if (existing) {
            logger.info(`[Idempotency] Cache hit for key: ${key}`);
            return res.status(existing.statusCode).json(existing.body);
        }

        const acquiredLock = await IdempotencyStore.lock(storageKey);
        if (!acquiredLock) {
            return res.status(409).json({
                message: 'Request already in progress with this idempotency key',
            });
        }

        // Intercept res.json to cache the response
        const originalJson = res.json;
        res.json = function (body: any) {
            IdempotencyStore.set(storageKey, {
                statusCode: res.statusCode,
                body,
            }).catch(err => logger.error('Failed to cache idempotent response', { err }));

            IdempotencyStore.unlock(storageKey).catch(err => logger.error('Failed to unlock idempotency key', { err }));

            return originalJson.call(this, body);
        };

        next();
    } catch (err) {
        logger.error('Idempotency middleware error', { err });
        next();
    }
};
