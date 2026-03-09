import { injectable } from 'tsyringe';
import { Prisma, User } from '@prisma/client';
import { ISellerRepository } from '../interfaces/seller.repository.interface';
import { prisma, prismaRead } from '@/infrastructure/database/prisma';

@injectable()
export class PrismaSellerRepository implements ISellerRepository {
    async findUnique(id: string): Promise<User | null> {
        return prismaRead.user.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return prisma.$transaction(fn);
    }
}
