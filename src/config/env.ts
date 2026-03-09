import { cleanEnv, str, port, url } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
    PORT: port({ default: 3000 }),
    DATABASE_URL: str(),
    REDIS_URL: str({ default: 'redis://localhost:6379' }),
    JWT_SECRET: str(),
    JWT_EXPIRES_IN: str({ default: '7d' }),
    JWT_REFRESH_SECRET: str(),
    JWT_REFRESH_EXPIRES_IN: str({ default: '30d' }),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    GOOGLE_CALLBACK_URL: url(),
    STRIPE_SECRET_KEY: str(),
    STRIPE_WEBHOOK_SECRET: str(),
    STRIPE_CURRENCY: str({ default: 'usd' }),
    FIREBASE_PROJECT_ID: str(),
    FIREBASE_PRIVATE_KEY: str(),
    FIREBASE_CLIENT_EMAIL: str(),
    CLIENT_URL: url({ default: 'http://localhost:3001' }),
    API_VERSION: str({ default: 'v1' }),
});
