import { Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { SellerService } from '../services/seller.service';

@injectable()
export class SellerController {
    constructor(private sellerService: SellerService) { }
    onboardSeller = async (req: any, res: Response, next: NextFunction) => {
        try {
            const url = await this.sellerService.onboardSeller(req.user.id, req.user.email, req.user.stripeAccountId);
            res.status(200).json({
                success: true,
                message: 'Stripe onboarding link generated',
                data: { onboardingUrl: url },
            });
        } catch (error) {
            next(error);
        }
    }

    getDashboard = async (req: any, res: Response, next: NextFunction) => {
        try {
            const stats = await this.sellerService.getDashboard(req.user.id);
            res.status(200).json({
                success: true,
                message: 'Dashboard data fetched',
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }
}
