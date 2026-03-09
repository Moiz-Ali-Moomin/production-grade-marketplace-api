import { redis } from '../cache/redis';

export interface IdempotencyRecord {
    statusCode: number;
    body: any;
}

export class IdempotencyStore {
    private static readonly PREFIX = 'idempotency:';
    private static readonly TTL = 60 * 60 * 24; // 24 hours

    static async get(key: string): Promise<IdempotencyRecord | null> {
        const data = await redis.get(this.PREFIX + key);
        return data ? JSON.parse(data) : null;
    }

    static async set(key: string, record: IdempotencyRecord): Promise<void> {
        await redis.setex(
            this.PREFIX + key,
            this.TTL,
            JSON.stringify(record)
        );
    }

    static async lock(key: string): Promise<boolean> {
        const result = await redis.set(
            this.PREFIX + 'lock:' + key,
            'LOCKED',
            'EX',
            30, // 30s lock for processing
            'NX'
        );
        return result === 'OK';
    }

    static async unlock(key: string): Promise<void> {
        await redis.del(this.PREFIX + 'lock:' + key);
    }
}
