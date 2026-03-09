import { User, Role } from '@prisma/client';

export interface UserDto {
    id: string;
    email: string;
    name: string;
    role: Role;
    isActive: boolean;
    avatar?: string;
    stripeAccountId?: string;
    createdAt: Date;
}

export class AuthMapper {
    static toUserDto(user: User): UserDto {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            avatar: user.avatar || undefined,
            stripeAccountId: user.stripeAccountId || undefined,
            createdAt: user.createdAt,
        };
    }
}
