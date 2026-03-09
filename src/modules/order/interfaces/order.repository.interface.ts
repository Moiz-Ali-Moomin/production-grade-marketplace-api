import { Prisma, Order } from '@prisma/client';

export interface IOrderRepository {
    findMany(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OrderWhereUniqueInput;
        where?: Prisma.OrderWhereInput;
        orderBy?: Prisma.OrderOrderByWithRelationInput;
        include?: Prisma.OrderInclude;
    }): Promise<Order[]>;

    findUnique(id: string, include?: Prisma.OrderInclude): Promise<Order | null>;

    findFirst(where: Prisma.OrderWhereInput, include?: Prisma.OrderInclude): Promise<Order | null>;

    create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>;

    update(id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<Order>;

    count(where: Prisma.OrderWhereInput): Promise<number>;

    transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
