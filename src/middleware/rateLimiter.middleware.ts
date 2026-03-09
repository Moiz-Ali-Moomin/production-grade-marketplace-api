import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: env.NODE_ENV === 'production' ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts, please try again after an hour',
    },
});
