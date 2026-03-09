import { PrismaClient } from '@prisma/client';
import { logger } from '../../observability/logger';
import { env } from '../../config/env';

export const prisma = new PrismaClient({
    datasources: { db: { url: env.DATABASE_URL } },
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const prismaRead = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL_READ || env.DATABASE_URL } },
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export const connectDatabase = async () => {
    try {
        await Promise.all([
            prisma.$connect(),
            prismaRead.$connect(),
        ]);
        logger.info('🐘 Primary and Replica databases connected');
    } catch (error) {
        logger.error('❌ Database connection failed', { error });
        throw error;
    }
};

export const disconnectDatabase = async () => {
    await Promise.all([
        prisma.$disconnect(),
        prismaRead.$disconnect(),
    ]);
};
