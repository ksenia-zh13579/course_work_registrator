import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export const registry = new OpenAPIRegistry();

export function generateSwaggerDoc() {
    const generator = new OpenApiGeneratorV3(registry.definitions);
    return generator.generateDocument({
        openapi: '3.0.3',
        info: {
            title: 'Registrator API',
            version: '1.0.0',
            description: 'Документация для сервиса регистрации инцидентов',
        },
        servers: [{ url: '/api' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    });
}