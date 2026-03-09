import { Prisma, PrismaClient, User } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { ISellerRepository } from '../interfaces/seller.repository.interface';

@injectable()
export class PrismaSellerRepository implements ISellerRepository {
    constructor(
        @inject('PrismaClient') private prisma: PrismaClient
    ) { }

    async findUnique(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async aggregate(fn: (prisma: PrismaClient) => Promise<any>): Promise<any> {
        return fn(this.prisma);
    }

    async countOrders(where: Prisma.OrderWhereInput): Promise<number> {
        return this.prisma.order.count({ where });
    }

    async aggregateOrders(where: Prisma.OrderWhereInput): Promise<any> {
        return this.prisma.order.aggregate({
            where,
            _sum: { totalAmount: true },
        });
    }

    async countProducts(where: Prisma.ProductWhereInput): Promise<number> {
        return this.prisma.product.count({ where });
    }

    async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(fn);
    }
}
