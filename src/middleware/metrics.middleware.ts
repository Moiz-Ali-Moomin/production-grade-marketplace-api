import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { MetricsService } from '../observability/metrics';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const metrics = container.resolve(MetricsService);
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route ? req.route.path : 'unknown';

        metrics.httpRequestDuration.observe(
            {
                method: req.method,
                route: route,
                status_code: res.statusCode.toString(),
            },
            duration
        );
    });

    next();
};
