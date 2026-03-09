import { injectable, inject } from 'tsyringe';
import Stripe from 'stripe';
import { ConflictError } from '@/shared/errors/DomainErrors';
import { env } from '@/config/env';
import { ISellerRepository } from '../interfaces/seller.repository.interface';
import { SellerMapper, SellerDashboardDto } from '../mappers/seller.mapper';

@injectable()
export class SellerService {
    constructor(
        @inject('SellerRepository') private sellerRepository: ISellerRepository,
        @inject('Stripe') private stripe: Stripe
    ) { }

    async onboardSeller(userId: string, email: string, stripeAccountId?: string): Promise<string> {
        if (stripeAccountId) throw new ConflictError('Stripe account already exists');

        const account = await this.stripe.accounts.create({
            type: 'express',
            email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        await this.sellerRepository.update(userId, { stripeAccountId: account.id });

        const accountLink = await this.stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${env.CLIENT_URL}/seller/onboarding/refresh`,
            return_url: `${env.CLIENT_URL}/seller/onboarding/complete`,
            type: 'account_onboarding',
        });

        return accountLink.url;
    }

    async getDashboard(userId: string): Promise<SellerDashboardDto> {
        const [totalOrders, totalRevenue, pendingOrders, totalProducts] = await this.sellerRepository.transaction(async (tx: any) => {
            return Promise.all([
                tx.order.count({ where: { sellerId: userId } }),
                tx.order.aggregate({
                    where: { sellerId: userId, status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
                    _sum: { totalAmount: true },
                }),
                tx.order.count({ where: { sellerId: userId, status: 'PAID' } }),
                tx.product.count({ where: { sellerId: userId, isActive: true } }),
            ]);
        });

        return SellerMapper.toDashboardDto({
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            pendingOrders,
            totalProducts,
        });
    }
}
