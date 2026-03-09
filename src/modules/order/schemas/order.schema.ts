import { z } from 'zod';

export const orderItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1),
    notes: z.string().optional(),
});

export const orderQuerySchema = z.object({
    page: z.string().optional().transform(v => parseInt(v || '1')),
    limit: z.string().optional().transform(v => parseInt(v || '10')),
    status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
