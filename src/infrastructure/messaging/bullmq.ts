import { Queue, Worker } from 'bullmq';
import { redis } from '@/infrastructure/cache/redis';

// Standard BullMQ configuration for production
export const defaultJobOptions = {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
};

export const createQueue = (name: string) => {
    return new Queue(name, {
        connection: redis as any, // Cast to any to avoid version mismatch between bullmq/ioredis
        defaultJobOptions,
    });
};

export const createWorker = (name: string, processor: any) => {
    return new Worker(name, processor, {
        connection: redis as any,
    });
};
