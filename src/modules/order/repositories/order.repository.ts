import { Prisma, Order, PrismaClient } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { IOrderRepository } from '../interfaces/order.repository.interface';

@injectable()
export class PrismaOrderRepository implements IOrderRepository {
    constructor(
        @inject('PrismaClient') private prisma: PrismaClient
    ) { }
    async findMany(params: {
        skip?: number;
        take?: number;
        where?: Prisma.OrderWhereInput;
        orderBy?: Prisma.OrderOrderByWithRelationInput;
        include?: Prisma.OrderInclude;
    }): Promise<Order[]> {
        const { skip, take, where, orderBy, include } = params;
        return this.prisma.order.findMany({
            skip,
            take,
            where,
            orderBy,
            include,
        });
    }

    async findUnique(id: string, include?: Prisma.OrderInclude): Promise<Order | null> {
        return this.prisma.order.findUnique({
            where: { id },
            include,
        });
    }

    async findFirst(where: Prisma.OrderWhereInput, include?: Prisma.OrderInclude): Promise<Order | null> {
        return this.prisma.order.findFirst({
            where,
            include,
        });
    }

    async create(data: Prisma.OrderUncheckedCreateInput): Promise<Order> {
        return this.prisma.order.create({
            data,
        });
    }

    async update(id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<Order> {
        return this.prisma.order.update({
            where: { id },
            data,
        });
    }

    async count(where: Prisma.OrderWhereInput): Promise<number> {
        return this.prisma.order.count({ where });
    }

    async transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(fn);
    }
}
