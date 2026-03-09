import { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client';
import { injectable, singleton } from 'tsyringe';

@singleton()
@injectable()
export class MetricsService {
    private readonly registry: Registry;

    public readonly httpRequestDuration: Histogram<string>;
    public readonly orderTotal: Counter<string>;
    public readonly paymentFailures: Counter<string>;

    constructor() {
        this.registry = new Registry();
        this.registry.setDefaultLabels({ service: 'marketplace-api', env: process.env.NODE_ENV || 'development' });

        collectDefaultMetrics({ register: this.registry });

        this.httpRequestDuration = new Histogram({
            name: 'http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10],
            registers: [this.registry],
        });

        this.orderTotal = new Counter({
            name: 'orders_created_total',
            help: 'Total number of orders created',
            registers: [this.registry],
        });

        this.paymentFailures = new Counter({
            name: 'payment_failures_total',
            help: 'Total number of payment attempts that failed',
            labelNames: ['reason'],
            registers: [this.registry],
        });
    }

    public async getMetrics(): Promise<string> {
        return this.registry.metrics();
    }

    public getRegistry(): Registry {
        return this.registry;
    }
}

// Legacy exports for app.ts compatibility
import { container } from '@/container/container';
export const metricsHandler = async (_req: any, res: any) => {
    const metrics = container.resolve(MetricsService);
    res.set('Content-Type', metrics.getRegistry().contentType);
    res.end(await metrics.getMetrics());
};

// Export singleton for direct use if needed
const metricsInstance = container.resolve(MetricsService);
export const httpRequestDurationMicroseconds = metricsInstance.httpRequestDuration;
