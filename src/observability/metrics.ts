import client from 'prom-client';
import { Request, Response } from 'express';

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
client.collectDefaultMetrics({ register });

// Http request duration histogram
export const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

register.registerMetric(httpRequestDurationMicroseconds);

export const metricsHandler = async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
};
