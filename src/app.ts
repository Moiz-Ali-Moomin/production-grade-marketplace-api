import 'reflect-metadata';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import { env } from '@/config/env';
import { logger } from '@/observability/logger';
import { healthCheckHandler } from '@/observability/health';
import { metricsHandler, httpRequestDurationMicroseconds } from '@/observability/metrics';
import { errorHandler, notFound } from '@/middleware/error.middleware';
import { apiLimiter } from '@/middleware/rateLimiter.middleware';
import { SocketServer } from '@/realtime/socketServer';

import { v1Router } from '@/api/v1';
import { requestIdMiddleware } from '@/middleware/requestId.middleware';
import { setupSwagger } from '@/docs/swagger';

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket Server
SocketServer.init(httpServer);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(requestIdMiddleware);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Request duration tracking for metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration / 1000);
  });
  next();
});

// Parsers
app.use('/api/v1/orders/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
app.use('/api', apiLimiter);

// ─── Observability Endpoints ──────────────────────────────────────────────────
app.get('/health', healthCheckHandler);
app.get('/metrics', metricsHandler);

// ─── Swagger ─────────────────────────────────────────────────────────────────
setupSwagger(app);

// ─── Routes ───────────────────────────────────────────────────────────────────
const v1 = `/api/${env.API_VERSION}`;
app.use(v1, v1Router);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export { app, httpServer };
