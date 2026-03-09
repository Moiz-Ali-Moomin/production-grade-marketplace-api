import { Prisma, Order } from '@prisma/client';
import { injectable } from 'tsyringe';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { prisma, prismaRead } from '@/infrastructure/database/prisma';

@injectable()
export class PrismaOrderRepository implements IOrderRepository {
    async findMany(params: {
        skip?: number;
        take?: number;
        where?: Prisma.OrderWhereInput;
        orderBy?: Prisma.OrderOrderByWithRelationInput;
        include?: Prisma.OrderInclude;
    }): Promise<Order[]> {
        const { skip, take, where, orderBy, include } = params;
        return prismaRead.order.findMany({
            skip,
            take,
            where,
            orderBy,
            include,
        });
    }

    async findUnique(id: string, include?: Prisma.OrderInclude): Promise<Order | null> {
        return prismaRead.order.findUnique({
            where: { id },
            include,
        });
    }

    async findFirst(where: Prisma.OrderWhereInput, include?: Prisma.OrderInclude): Promise<Order | null> {
        return prismaRead.order.findFirst({
            where,
            include,
        });
    }

    async create(data: Prisma.OrderUncheckedCreateInput): Promise<Order> {
        return prisma.order.create({
            data,
        });
    }

    async update(id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<Order> {
        return prisma.order.update({
            where: { id },
            data,
        });
    }

    async count(where: Prisma.OrderWhereInput): Promise<number> {
        return prismaRead.order.count({ where });
    }

    async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return prisma.$transaction(fn);
    }
}
