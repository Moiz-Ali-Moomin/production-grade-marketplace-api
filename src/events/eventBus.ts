import { EventEmitter } from 'events';
import { injectable, singleton } from 'tsyringe';
import { logger } from '@/observability/logger';

export enum DomainEvent {
    USER_REGISTERED = 'user.registered',
    PRODUCT_CREATED = 'product.created',
    ORDER_CREATED = 'order.created',
    PAYMENT_SUCCEEDED = 'payment.succeeded',
    NOTIFICATION_SENT = 'notification.sent',
}

export interface IEventPayload {
    [key: string]: any;
}

@injectable()
@singleton()
export class EventBus {
    private emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();
        this.emitter.setMaxListeners(20);
    }

    emit(event: DomainEvent, payload: IEventPayload): void {
        logger.info(`[EventBus] Emitting event: ${event}`, { payload } as any);
        this.emitter.emit(event, payload);
    }

    on(event: DomainEvent, handler: (payload: IEventPayload) => void): void {
        this.emitter.on(event, handler);
    }

    once(event: DomainEvent, handler: (payload: IEventPayload) => void): void {
        this.emitter.once(event, handler);
    }

    off(event: DomainEvent, handler: (payload: IEventPayload) => void): void {
        this.emitter.off(event, handler);
    }
}

export const eventBus = new EventBus();
