import { Product } from '@prisma/client';

export interface ProductDto {
    id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    categoryId: string;
    sellerId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    seller?: {
        id: string;
        name: string;
        avatar?: string;
    };
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    _count?: {
        reviews: number;
    };
}

export class ProductMapper {
    static toDto(product: Product & any): ProductDto {
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images,
            categoryId: product.categoryId,
            sellerId: product.sellerId,
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            seller: product.seller ? {
                id: product.seller.id,
                name: product.seller.name,
                avatar: product.seller.avatar,
            } : undefined,
            category: product.category ? {
                id: product.category.id,
                name: product.category.name,
                slug: product.category.slug,
            } : undefined,
            _count: product._count ? {
                reviews: product._count.reviews,
            } : undefined,
        };
    }

    static toCollectionDto(products: (Product & any)[]): ProductDto[] {
        return products.map(this.toDto);
    }
}
