import { injectable, singleton } from 'tsyringe';
import { redis } from '@/infrastructure/cache/redis';
import { logger } from './logger';

@singleton()
@injectable()
export class FeatureFlagService {
    private readonly REDIS_PREFIX = 'ff:';
    private localCache: Map<string, boolean> = new Map();

    constructor() {
        this.init();
    }

    private async init() {
        // In a real FAANG system, this might poll an external service like LaunchDarkly or ConfigCat
        try {
            const flags = await redis.hgetall(`${this.REDIS_PREFIX}active`);
            Object.entries(flags).forEach(([key, value]) => {
                this.localCache.set(key, value === 'true');
            });
            logger.info('🚩 Feature flags synchronized from Redis');
        } catch (error) {
            logger.error('Failed to sync feature flags', { error });
        }
    }

    public isEnabled(flagName: string, defaultValue = false): boolean {
        return this.localCache.has(flagName)
            ? this.localCache.get(flagName)!
            : defaultValue;
    }

    /**
     * For testing or emergency overrides
     */
    public async setFlag(flagName: string, enabled: boolean): Promise<void> {
        this.localCache.set(flagName, enabled);
        await redis.hset(`${this.REDIS_PREFIX}active`, flagName, String(enabled));
    }
}
