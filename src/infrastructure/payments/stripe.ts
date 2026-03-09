import Stripe from 'stripe';
import { env } from '../../config/env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16' as any,
    appInfo: {
        name: 'Marketplace API',
        version: '1.0.0',
    },
});
