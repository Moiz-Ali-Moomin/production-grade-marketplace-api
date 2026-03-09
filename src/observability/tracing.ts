import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { logger } from './logger';

// Use a more robust exporter configuration
const exporter = new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
});

const sdk = new NodeSDK({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'marketplace-api',
    }),
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
});

export const initTracing = () => {
    try {
        sdk.start();
        logger.info('🔭 OpenTelemetry Tracing initialized');
    } catch (error) {
        logger.error('Failed to initialize tracing', { error });
    }

    process.on('SIGTERM', () => {
        sdk.shutdown()
            .then(() => logger.info('Tracing terminated'))
            .catch((error: any) => logger.error('Error terminating tracing', { error }))
            .finally(() => process.exit(0));
    });
};
