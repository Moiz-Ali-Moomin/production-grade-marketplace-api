import 'reflect-metadata';
import { container } from 'tsyringe';
import { MetricsService } from '@/observability/metrics';
import { FeatureFlagService } from '@/observability/featureFlags';
import { prisma } from '@/infrastructure/database/prisma';
import { redis } from '@/infrastructure/cache/redis';
import { stripe } from '@/infrastructure/payments/stripe';
import { firebase } from '@/infrastructure/auth/firebase';

// Register Infrastructure
container.registerSingleton(MetricsService);
container.registerSingleton(FeatureFlagService);

// Repositories
import { PrismaProductRepository } from '@/modules/product/repositories/product.repository';
import { PrismaOrderRepository } from '@/modules/order/repositories/order.repository';
import { PrismaSellerRepository } from '@/modules/seller/repositories/seller.repository';
import { PrismaAuthRepository } from '@/modules/auth/repositories/auth.repository';

// Register Infrastructure
container.registerInstance('PrismaClient', prisma);
container.registerInstance('Redis', redis);
container.registerInstance('Stripe', stripe);
container.registerInstance('Firebase', firebase);

// Register Repositories
container.register('ProductRepository', { useClass: PrismaProductRepository });
container.register('OrderRepository', { useClass: PrismaOrderRepository });
container.register('SellerRepository', { useClass: PrismaSellerRepository });
container.register('AuthRepository', { useClass: PrismaAuthRepository });

export { container };
