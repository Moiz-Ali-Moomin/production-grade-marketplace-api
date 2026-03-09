import Stripe from 'stripe';
import CircuitBreaker from 'opossum';
import { env } from '@/config/env';
import { logger } from '@/observability/logger';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

const breakerOptions = {
    timeout: 5000, // 5 seconds
    errorThresholdPercentage: 50,
    resetTimeout: 30000, // 30 seconds
};

export class StripeClient {
    private static breaker = new CircuitBreaker(async (fn: any) => await fn(), breakerOptions);

    static {
        this.breaker.on('open', () => logger.warn('Stripe Circuit Breaker OPENED'));
        this.breaker.on('halfOpen', () => logger.info('Stripe Circuit Breaker HALF-OPEN'));
        this.breaker.on('close', () => logger.info('Stripe Circuit Breaker CLOSED'));
        this.breaker.on('fallback', () => logger.warn('Stripe Circuit Breaker falling back'));
    }

    static async execute<T>(action: (stripe: Stripe) => Promise<T>, fallbackValue?: T): Promise<T> {
        try {
            return await this.breaker.fallback(() => fallbackValue).fire(() => action(stripe));
        } catch (error) {
            logger.error('Stripe API Error (via Breaker)', { error });
            throw error;
        }
    }

    static get raw(): Stripe {
        return stripe;
    }
}
