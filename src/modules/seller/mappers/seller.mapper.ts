export interface SellerDashboardDto {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    totalProducts: number;
}

export class SellerMapper {
    static toDashboardDto(data: {
        totalOrders: number;
        totalRevenue: number;
        pendingOrders: number;
        totalProducts: number;
    }): SellerDashboardDto {
        return {
            totalOrders: data.totalOrders,
            totalRevenue: data.totalRevenue,
            pendingOrders: data.pendingOrders,
            totalProducts: data.totalProducts,
        };
    }
}
