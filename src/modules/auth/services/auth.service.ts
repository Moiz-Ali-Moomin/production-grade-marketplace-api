import bcrypt from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import Redis from 'ioredis';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt';
import { ConflictError, UnauthorizedError } from '@/shared/errors/DomainErrors';
import { AuthResponse } from '../auth.types';
import { IAuthRepository } from '../interfaces/auth.repository.interface';
import { AuthMapper } from '../mappers/auth.mapper';
import { eventBus, DomainEvent } from '@/events/eventBus';

@injectable()
export class AuthService {
    constructor(
        @inject('AuthRepository') private authRepository: IAuthRepository,
        @inject('Redis') private redis: Redis
    ) { }

    async register(data: any): Promise<AuthResponse> {
        const { name, email, password, role } = data;
        const existing = await this.authRepository.findUnique(email);
        if (existing) throw new ConflictError('Email already in use');

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.authRepository.create({
            name, email, password: hashedPassword, role
        });

        const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        eventBus.emit(DomainEvent.USER_REGISTERED, { userId: user.id, email: user.email });

        return { user: AuthMapper.toUserDto(user), ...tokens };
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await this.authRepository.findUnique(email);
        if (!user || !user.password) throw new UnauthorizedError('Invalid credentials');
        if (!user.isActive) throw new UnauthorizedError('Account is disabled');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new UnauthorizedError('Invalid credentials');

        const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return { user: AuthMapper.toUserDto(user), ...tokens };
    }

    async refreshTokens(token: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const payload = verifyRefreshToken(token);
            const stored = await this.redis.get(`refresh:${payload.userId}`);
            if (stored !== token) throw new UnauthorizedError('Invalid refresh token');

            const user = await this.authRepository.findById(payload.userId);
            if (!user) throw new UnauthorizedError('User not found');

            const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });
            await this.saveRefreshToken(user.id, tokens.refreshToken);

            return tokens;
        } catch {
            throw new UnauthorizedError('Invalid refresh token');
        }
    }

    async logout(userId: string): Promise<void> {
        await this.redis.del(`refresh:${userId}`);
    }

    private async saveRefreshToken(userId: string, token: string): Promise<void> {
        await this.redis.set(`refresh:${userId}`, token, 'EX', 7 * 24 * 60 * 60);
    }
}
