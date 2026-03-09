import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '@/shared/errors/DomainErrors';

@injectable()
export class ChatService {
    constructor(
        @inject('PrismaClient') private prisma: PrismaClient
    ) { }
    async getMyChatRooms(userId: string) {
        return this.prisma.chatRoom.findMany({
            where: { users: { some: { userId } } },
            include: {
                users: { include: { user: { select: { id: true, name: true, avatar: true } } } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                order: { select: { id: true, status: true, totalAmount: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getMessages(roomId: string, userId: string, query: any) {
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '30');
        const skip = (page - 1) * limit;

        const member = await this.prisma.chatRoomUser.findUnique({
            where: { userId_chatRoomId: { userId, chatRoomId: roomId } },
        });
        if (!member) throw new NotFoundError('Chat room');

        const [messages, total] = await this.prisma.$transaction([
            this.prisma.message.findMany({
                where: { chatRoomId: roomId },
                orderBy: { createdAt: 'desc' },
                take: limit, skip,
                include: { sender: { select: { id: true, name: true, avatar: true } } },
            }),
            this.prisma.message.count({ where: { chatRoomId: roomId } }),
        ]);

        await this.prisma.message.updateMany({
            where: { chatRoomId: roomId, senderId: { not: userId }, isRead: false },
            data: { isRead: true },
        });

        return {
            messages: messages.reverse(),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }

    async saveMessage(roomId: string, senderId: string, content: string) {
        const member = await this.prisma.chatRoomUser.findUnique({
            where: { userId_chatRoomId: { userId: senderId, chatRoomId: roomId } },
        });
        if (!member) throw new ForbiddenError('Not a member of this chat room');

        return this.prisma.message.create({
            data: { chatRoomId: roomId, senderId, content },
            include: { sender: { select: { id: true, name: true, avatar: true } } },
        });
    }
}
