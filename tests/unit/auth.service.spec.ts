import { AuthService } from '../../src/modules/auth/auth.service';
import { prismaMock } from '../setup';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
    describe('login', () => {
        it('should throw UnauthorizedError if user not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(AuthService.login('test@example.com', 'password')).rejects.toThrow('Invalid credentials');
        });

        it('should return user and tokens on successful login', async () => {
            const user = {
                id: 'user-1',
                email: 'test@example.com',
                password: await bcrypt.hash('password', 12),
                name: 'Test User',
                role: 'BUYER',
                isActive: true,
            };
            prismaMock.user.findUnique.mockResolvedValue(user as any);

            const result = await AuthService.login('test@example.com', 'password');

            expect(result.user.email).toBe(user.email);
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
        });
    });
});
