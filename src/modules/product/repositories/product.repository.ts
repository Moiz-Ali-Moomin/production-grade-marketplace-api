import { Prisma, Product } from '@prisma/client';
import { injectable } from 'tsyringe';
import { IProductRepository } from '../interfaces/product.repository.interface';
import { prisma, prismaRead } from '@/infrastructure/database/prisma';

@injectable()
export class PrismaProductRepository implements IProductRepository {
    async findMany(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ProductWhereUniqueInput;
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
        include?: Prisma.ProductInclude;
    }): Promise<Product[]> {
        const { skip, take, cursor, where, orderBy, include } = params;
        return prismaRead.product.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    async findUnique(id: string, include?: Prisma.ProductInclude): Promise<Product | null> {
        return prismaRead.product.findUnique({
            where: { id },
            include,
        });
    }

    async findFirst(where: Prisma.ProductWhereInput, include?: Prisma.ProductInclude): Promise<Product | null> {
        return prismaRead.product.findFirst({
            where,
            include,
        });
    }

    async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
        return prisma.product.create({
            data,
        });
    }

    async update(id: string, data: Prisma.ProductUncheckedUpdateInput): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data,
        });
    }

    async count(where: Prisma.ProductWhereInput): Promise<number> {
        return prismaRead.product.count({ where });
    }

    async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return prisma.$transaction(fn);
    }
}
