import { PrismaClient } from '@prisma/client';
import { logger } from '../../observability/logger';
import { env } from '../../config/env';

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: env.DATABASE_URL,
        },
    },
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const connectDatabase = async () => {
    try {
        await prisma.$connect();
        logger.info('🐘 Database connected successfully');
    } catch (error) {
        logger.error(error, '❌ Database connection failed');
        throw error; // Let the caller handle bootstrap failure
    }
};

export const disconnectDatabase = async () => {
    await prisma.$disconnect();
};
