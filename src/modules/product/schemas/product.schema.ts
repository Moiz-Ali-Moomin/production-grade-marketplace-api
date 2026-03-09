import { z } from 'zod';

export const createProductSchema = z.object({
    title: z.string().min(3).max(255),
    description: z.string().min(10),
    price: z.number().positive(),
    categoryId: z.string().uuid(),
    images: z.array(z.string().url()).optional(),
    stock: z.number().int().nonnegative(),
    tags: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
    page: z.string().optional().transform(v => parseInt(v || '1')),
    limit: z.string().optional().transform(v => parseInt(v || '10')),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    sellerId: z.string().uuid().optional(),
    minPrice: z.string().optional().transform(v => v ? parseFloat(v) : undefined),
    maxPrice: z.string().optional().transform(v => v ? parseFloat(v) : undefined),
    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'oldest']).optional().default('newest'),
    tags: z.string().optional().transform(v => v ? v.split(',') : undefined),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type ProductQueryDto = z.infer<typeof productQuerySchema>;
