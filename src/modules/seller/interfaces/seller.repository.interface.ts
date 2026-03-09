import { User, Prisma } from '@prisma/client';

export interface ISellerRepository {
    findUnique(id: string): Promise<User | null>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
