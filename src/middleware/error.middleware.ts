import { Request, Response, NextFunction } from 'express';
import { logger } from '../observability/logger';
import { env } from '../config/env';
import { ZodError } from 'zod';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';
    let success = false;
    let errors: any[] = [];

    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation failed';
        errors = err.issues;
    } else if (err.name === 'PrismaClientKnownRequestError') {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = 'Duplicate field value entered';
        } else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Record not found';
        }
    }

    // Log error
    logger.error({
        err,
        method: req.method,
        url: req.url,
        body: req.body,
        stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    res.status(statusCode).json({
        success,
        message,
        errors: errors.length > 0 ? errors : undefined,
        stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

export const notFound = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};
