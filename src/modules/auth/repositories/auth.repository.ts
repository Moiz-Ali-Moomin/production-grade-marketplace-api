import { injectable, inject } from 'tsyringe';
import { PrismaClient, Prisma, User } from '@prisma/client';
import { IAuthRepository } from '../interfaces/auth.repository.interface';

@injectable()
export class PrismaAuthRepository implements IAuthRepository {
    constructor(
        @inject('PrismaClient') private prisma: PrismaClient
    ) { }

    async findUnique(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
}
