import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ProductFilterQuery extends PaginationQuery {
  search?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sellerId?: string;
  tags?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
