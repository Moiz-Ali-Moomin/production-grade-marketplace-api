import { Prisma, Product, PrismaClient } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { IProductRepository } from '../interfaces/product.repository.interface';

@injectable()
export class PrismaProductRepository implements IProductRepository {
    constructor(
        @inject('PrismaClient') private prisma: PrismaClient
    ) { }
    async findMany(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ProductWhereUniqueInput;
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
        include?: Prisma.ProductInclude;
    }): Promise<Product[]> {
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.product.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    async findUnique(id: string, include?: Prisma.ProductInclude): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
            include,
        });
    }

    async findFirst(where: Prisma.ProductWhereInput, include?: Prisma.ProductInclude): Promise<Product | null> {
        return this.prisma.product.findFirst({
            where,
            include,
        });
    }

    async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
        return this.prisma.product.create({
            data,
        });
    }

    async update(id: string, data: Prisma.ProductUncheckedUpdateInput): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async count(where: Prisma.ProductWhereInput): Promise<number> {
        return this.prisma.product.count({ where });
    }

    async transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(fn);
    }
}
