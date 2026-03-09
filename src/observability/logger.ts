import winston from 'winston';
import { env } from '@/config/env';

/**
 * PII Masking Format
 * Masks sensitive fields such as 'email', 'password', 'token', 'cardNumber', etc.
 */
const maskPII = winston.format((info) => {
    const sensitiveKeys = ['password', 'token', 'email', 'cardNumber', 'cvv', 'creditCard'];

    const mask = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return obj;

        for (const key in obj) {
            if (sensitiveKeys.includes(key.toLowerCase())) {
                obj[key] = '***MASKED***';
            } else if (typeof obj[key] === 'object') {
                mask(obj[key]);
            }
        }
        return obj;
    };

    mask(info);
    return info;
});

const logger = winston.createLogger({
    level: env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        maskPII(),
        winston.format.json()
    ),
    defaultMeta: { service: 'marketplace-api' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                maskPII(),
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

export { logger };
