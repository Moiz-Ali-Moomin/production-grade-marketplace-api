import { Order, OrderStatus } from '@prisma/client';

export interface OrderDto {
    id: string;
    userId: string;
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: any;
    paymentIntentId?: string;
    createdAt: Date;
    updatedAt: Date;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    items?: any[];
}

export class OrderMapper {
    static toDto(order: Order & any): OrderDto {
        return {
            id: order.id,
            userId: order.userId,
            totalAmount: order.totalAmount,
            status: order.status,
            shippingAddress: order.shippingAddress,
            paymentIntentId: order.paymentIntentId,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            user: order.user ? {
                id: order.user.id,
                name: order.user.name,
                email: order.user.email,
            } : undefined,
            items: order.items,
        };
    }

    static toCollectionDto(orders: (Order & any)[]): OrderDto[] {
        return orders.map(this.toDto);
    }
}
