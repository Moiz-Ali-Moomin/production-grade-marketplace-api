import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { prisma } from '@/infrastructure/database/prisma';
import { UnauthorizedError, ForbiddenError } from '@/utils/AppError';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedError('Authentication required');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_SECRET) as any;

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(new UnauthorizedError('Invalid token'));
    }
};

export const requireRole = (...roles: string[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new UnauthorizedError('Authentication required');
        }

        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError('Insufficient permissions');
        }

        next();
    };
};
