import { logger } from '@/observability/logger';

export interface RetryOptions {
    retries: number;
    minTimeout: number;
    maxTimeout: number;
    factor: number;
}

const defaultOptions: RetryOptions = {
    retries: 3,
    minTimeout: 1000,
    maxTimeout: 10000,
    factor: 2,
};

export const withRetry = async <T>(
    fn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
): Promise<T> => {
    const { retries, minTimeout, maxTimeout, factor } = { ...defaultOptions, ...options };
    let currentDelay = minTimeout;

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt > retries) {
                throw error;
            }

            logger.warn(`Retry attempt ${attempt} failed. Retrying in ${currentDelay}ms...`, { error });
            await new Promise(resolve => setTimeout(resolve, currentDelay));
            currentDelay = Math.min(currentDelay * factor, maxTimeout);
        }
    }

    throw new Error('Retry failed'); // Should not reach here
};
