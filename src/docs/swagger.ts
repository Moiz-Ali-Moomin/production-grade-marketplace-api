import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { env } from '@/config/env';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Marketplace API',
            version: '1.0.0',
            description: 'Production-grade enterprise marketplace API',
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}/api/${env.API_VERSION}`,
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/modules/**/*.routes.ts', './src/api/**/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
};
