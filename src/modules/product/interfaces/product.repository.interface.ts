import { Prisma, Product } from '@prisma/client';

export interface IProductRepository {
    findMany(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ProductWhereUniqueInput;
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
        include?: Prisma.ProductInclude;
    }): Promise<Product[]>;

    findUnique(id: string, include?: Prisma.ProductInclude): Promise<Product | null>;

    findFirst(where: Prisma.ProductWhereInput, include?: Prisma.ProductInclude): Promise<Product | null>;

    create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>;

    update(id: string, data: Prisma.ProductUncheckedUpdateInput): Promise<Product>;

    count(where: Prisma.ProductWhereInput): Promise<number>;

    transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
