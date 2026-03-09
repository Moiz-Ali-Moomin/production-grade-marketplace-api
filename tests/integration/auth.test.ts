import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/infrastructure/database/prisma';

describe('Auth Integration Tests', () => {
    beforeAll(async () => {
        await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123',
                    role: 'BUYER'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('test@example.com');
            expect(response.body.data.accessToken).toBeDefined();
        });

        it('should return 409 if email already exists', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123',
                    role: 'BUYER'
                });

            expect(response.status).toBe(409);
        });
    });
});
