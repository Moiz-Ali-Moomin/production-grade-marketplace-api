import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { ProductService } from '../services/product.service';
import { productQuerySchema, createProductSchema, updateProductSchema } from '../schemas/product.schema';

@injectable()
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    getProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = productQuerySchema.parse(req.query);
            const result = await this.productService.getProducts(query);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    getProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.productService.getProductById(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = createProductSchema.parse(req.body);
            const sellerId = (req as any).user.id; // Assume auth middleware sets user
            const result = await this.productService.createProduct(sellerId, data);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = updateProductSchema.parse(req.body);
            const sellerId = (req as any).user.id;
            const result = await this.productService.updateProduct(req.params.id, sellerId, data);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sellerId = (req as any).user.id;
            await this.productService.deleteProduct(req.params.id, sellerId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
