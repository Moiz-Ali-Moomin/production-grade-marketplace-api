import { eventBus, DomainEvent } from './eventBus';
import { createQueue } from '@/infrastructure/messaging/bullmq';
import { logger } from '@/observability/logger';

const orderQueue = createQueue('order-queue');

export const initEventHandlers = () => {
    logger.info('[Events] Initializing domain event handlers');

    // Order Events
    eventBus.on(DomainEvent.ORDER_CREATED, async (payload) => {
        logger.info(`[Handler] Order Created: ${payload.orderId}. Enqueueing background job.`);
        await orderQueue.add('process-new-order', {
            orderId: payload.orderId,
            type: 'PROCESSING'
        });
    });

    // Product Events
    eventBus.on(DomainEvent.PRODUCT_CREATED, async (payload) => {
        logger.info(`[Handler] Product Created: ${payload.productId} by seller ${payload.sellerId}`);
        // Add specific handling if needed (e.g., notify followers)
    });

    // Other events can be added here...
};
