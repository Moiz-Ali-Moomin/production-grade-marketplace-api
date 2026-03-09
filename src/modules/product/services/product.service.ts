import { Prisma } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { IProductRepository } from '../interfaces/product.repository.interface';
import { ProductMapper, ProductDto } from '../mappers/product.mapper';
import { redis } from '@/infrastructure/cache/redis';
import { NotFoundError, ForbiddenError } from '@/shared/errors/DomainErrors';
import { ProductQueryDto, CreateProductDto, UpdateProductDto } from '../schemas/product.schema';
import { eventBus, DomainEvent } from '@/events/eventBus';

@injectable()
export class ProductService {
    constructor(
        @inject('ProductRepository') private readonly productRepository: IProductRepository
    ) { }

    async getProducts(query: ProductQueryDto): Promise<{ products: ProductDto[], meta: any }> {
        const { page, limit, search, categoryId, sellerId, minPrice, maxPrice, sortBy, tags } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = { isActive: true };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { has: search } },
            ];
        }
        if (categoryId) where.categoryId = categoryId;
        if (sellerId) where.sellerId = sellerId;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) (where.price as Prisma.FloatFilter).gte = minPrice;
            if (maxPrice) (where.price as Prisma.FloatFilter).lte = maxPrice;
        }
        if (tags) where.tags = { hasSome: tags };

        const orderByMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
            price_asc: { price: 'asc' },
            price_desc: { price: 'desc' },
            newest: { createdAt: 'desc' },
            oldest: { createdAt: 'asc' },
        };
        const orderBy = orderByMap[sortBy || 'newest'];

        const cacheKey = `products:${JSON.stringify({ where, orderBy, limit, skip })}`;
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const products = await this.productRepository.findMany({
            where,
            orderBy,
            take: limit,
            skip,
            include: {
                seller: { select: { id: true, name: true, avatar: true } },
                category: { select: { id: true, name: true, slug: true } },
                _count: { select: { reviews: true } },
            },
        });

        const total = await this.productRepository.count(where);

        const result = {
            products: ProductMapper.toCollectionDto(products),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };

        await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
        return result;
    }

    async getProductById(id: string): Promise<ProductDto> {
        const cacheKey = `product:${id}`;
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const product = await this.productRepository.findFirst(
            { id, isActive: true },
            {
                seller: { select: { id: true, name: true, avatar: true } },
                category: true,
                reviews: {
                    include: { user: { select: { id: true, name: true, avatar: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                _count: { select: { reviews: true } },
            }
        );

        if (!product) throw new NotFoundError('Product');

        const mapped = ProductMapper.toDto(product);
        await redis.set(cacheKey, JSON.stringify(mapped), 'EX', 120);
        return mapped;
    }

    async createProduct(sellerId: string, data: CreateProductDto): Promise<ProductDto> {
        const product = await this.productRepository.create({
            ...data,
            sellerId,
        });

        const mapped = ProductMapper.toDto(product);
        eventBus.emit(DomainEvent.PRODUCT_CREATED, { productId: mapped.id, sellerId });

        return mapped;
    }

    async updateProduct(id: string, sellerId: string, data: UpdateProductDto): Promise<ProductDto> {
        const product = await this.productRepository.findUnique(id);
        if (!product) throw new NotFoundError('Product');
        if (product.sellerId !== sellerId) throw new ForbiddenError('You do not own this product');

        const updated = await this.productRepository.update(id, data);

        await redis.del(`product:${id}`);
        return ProductMapper.toDto(updated);
    }

    async deleteProduct(id: string, sellerId: string): Promise<void> {
        const product = await this.productRepository.findUnique(id);
        if (!product) throw new NotFoundError('Product');
        if (product.sellerId !== sellerId) throw new ForbiddenError('You do not own this product');

        await this.productRepository.update(id, { isActive: false });
        await redis.del(`product:${id}`);
    }
}
