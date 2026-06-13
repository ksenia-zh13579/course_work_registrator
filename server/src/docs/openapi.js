import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from '../validators/index.js';

export const registry = new OpenAPIRegistry();

const PORT = process.env.PORT || 3001;

export function generateSwaggerDoc() {
    const generator = new OpenApiGeneratorV3(registry.definitions);
    const doc = generator.generateDocument({
        openapi: '3.0.3',
        info: {
            title: 'Registrator API',
            version: '1.0.0',
            description: 'Документация для сервиса регистрации инцидентов',
        },
        servers: [{
            url: `http://localhost:${PORT}`,
            description: 'Локальный сервер',
        }],
        security: [{ bearerAuth: [] }],
    });

    doc.components = {
        ...doc.components,
        securitySchemes: {
            ...(doc.components?.securitySchemes ?? {}),
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT авторизация через заголовок Authorization',
            },
        },
    };

    return doc;
}