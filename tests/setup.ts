import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../src/infrastructure/database';
import { redis } from '../src/infrastructure/redis';

jest.mock('../src/infrastructure/database', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>(),
}));

jest.mock('../src/infrastructure/redis', () => ({
    __esModule: true,
    redis: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    },
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
    mockReset(prismaMock);
    jest.clearAllMocks();
});
