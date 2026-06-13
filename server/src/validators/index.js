import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export { z };

export const idParamsSchema = z.object({
    id: z.string().transform(Number).pipe(z.number().int().positive()).openapi({ example: '12' }),
});

export const errorResponseSchema = z.object({
    error: z.string().openapi({ example: 'Описание ошибки' }),
    details: z.array(z.any()).optional()
});