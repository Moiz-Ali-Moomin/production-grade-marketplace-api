import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { OrderService } from '../services/order.service';
import { createOrderSchema, orderQuerySchema } from '../schemas/order.schema';

@injectable()
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = createOrderSchema.parse(req.body);
            const user = (req as any).user;
            const result = await this.orderService.createOrder(user.id, user.email, data);
            res.status(201).json({
                success: true,
                message: 'Order created',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = orderQuerySchema.parse(req.query);
            const userId = (req as any).user.id;
            const result = await this.orderService.getMyOrders(userId, query);
            res.json({
                success: true,
                message: 'Orders fetched',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}
