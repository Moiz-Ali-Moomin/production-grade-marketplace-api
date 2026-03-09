import { Job } from 'bullmq';
import { BaseWorker } from './base.worker';
import { logger } from '@/observability/logger';

export interface OrderJobData {
    orderId: string;
    type: 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
}

export class OrderWorker extends BaseWorker<OrderJobData> {
    constructor() {
        super('order-queue');
    }

    protected async process(job: Job<OrderJobData>): Promise<any> {
        const { orderId, type } = job.data;
        logger.info(`[OrderWorker] Processing order ${orderId} with type ${type}`);

        // In a real application, you might:
        // 1. Send order confirmation email
        // 2. Update analytics
        // 3. Trigger shipping workflow

        switch (type) {
            case 'PROCESSING':
                // Handle processing logic
                break;
            case 'COMPLETED':
                // Handle completion logic
                break;
            default:
                break;
        }

        return { processed: true, orderId };
    }
}

export const orderWorker = new OrderWorker();
