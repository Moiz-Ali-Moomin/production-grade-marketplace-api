import { Worker, Job, Processor, WorkerOptions } from 'bullmq';
import { redis } from '@/infrastructure/cache/redis';
import { logger } from '@/observability/logger';

export abstract class BaseWorker<T = any, R = any> {
    protected worker: Worker<T, R>;

    constructor(protected queueName: string, options?: Partial<WorkerOptions>) {
        this.worker = new Worker<T, R>(
            queueName,
            this.process.bind(this),
            {
                connection: redis as any,
                ...options,
            }
        );

        this.setupListeners();
    }

    protected abstract process(job: Job<T>): Promise<R>;

    private setupListeners() {
        this.worker.on('completed', (job) => {
            logger.info(`[Worker: ${this.queueName}] Job ${job.id} completed successfully`);
        });

        this.worker.on('failed', (job, err) => {
            logger.error(`[Worker: ${this.queueName}] Job ${job?.id} failed: ${err.message}`, {
                error: err,
                data: job?.data,
            });
        });

        this.worker.on('error', (err) => {
            logger.error(`[Worker: ${this.queueName}] Worker error: ${err.message}`, { error: err });
        });
    }

    async close() {
        await this.worker.close();
    }
}
