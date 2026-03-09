import { injectable } from 'tsyringe';
import { Prisma, User } from '@prisma/client';
import { IAuthRepository } from '../interfaces/auth.repository.interface';
import { prisma, prismaRead } from '@/infrastructure/database/prisma';

@injectable()
export class PrismaAuthRepository implements IAuthRepository {
    async findUnique(email: string): Promise<User | null> {
        return prismaRead.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return prismaRead.user.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }
}
