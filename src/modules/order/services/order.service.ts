import { injectable, inject } from 'tsyringe';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { IProductRepository } from '@/modules/product/interfaces/product.repository.interface';
import { OrderMapper, OrderDto } from '../mappers/order.mapper';
import { stripe } from '@/infrastructure/payments/stripe';
import { NotFoundError } from '@/shared/errors/DomainErrors';
import { CreateOrderDto, OrderQueryDto } from '../schemas/order.schema';
import { eventBus, DomainEvent } from '@/events/eventBus';

@injectable()
export class OrderService {
    constructor(
        @inject('OrderRepository') private readonly orderRepository: IOrderRepository,
        @inject('ProductRepository') private readonly productRepository: IProductRepository
    ) { }

    async createOrder(buyerId: string, email: string, data: CreateOrderDto): Promise<{ order: OrderDto, clientSecret: string | null }> {
        const { items } = data;

        const products = await this.productRepository.findMany({
            where: { id: { in: items.map(i => i.productId) } },
        });

        if (products.length !== items.length) throw new NotFoundError('Some products');

        const totalAmount = items.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (product?.price || 0) * item.quantity;
        }, 0);

        return this.orderRepository.transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    buyerId,
                    sellerId: products[0].sellerId,
                    totalAmount,
                    status: 'PENDING',
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: products.find(p => p.id === item.productId)!.price,
                        })),
                    },
                },
                include: { items: true }
            });

            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalAmount * 100),
                currency: 'usd',
                metadata: { orderId: order.id },
                receipt_email: email,
            });

            const mapped = OrderMapper.toDto(order);
            eventBus.emit(DomainEvent.ORDER_CREATED, { orderId: mapped.id, buyerId });

            return { order: mapped, clientSecret: paymentIntent.client_secret };
        });
    }

    async getMyOrders(userId: string, query: OrderQueryDto): Promise<{ orders: OrderDto[], meta: any }> {
        const { page, limit, status } = query;
        const skip = (page - 1) * limit;

        const where: any = {
            OR: [{ buyerId: userId }, { sellerId: userId }],
        };
        if (status) where.status = status;

        const orders = await this.orderRepository.findMany({
            where,
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
        });

        const total = await this.orderRepository.count(where);

        return {
            orders: OrderMapper.toCollectionDto(orders),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
}
