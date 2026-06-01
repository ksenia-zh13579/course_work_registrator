import { AppError } from '../utils/errors.js';

/**
 * @param {import('zod').ZodSchema} schema - Zod-схема для валидации
 * @param {'body' | 'query' | 'params'} source - откуда брать данные (по умолчанию 'body')
 * @returns {Function} Express middleware
 */
export const validateRequest = (schema, source = 'body') => {
    return (req, _res, next) => {
        const data = req[source];
        const result = schema.safeParse(data);

        if (!result.success) {
            const errors = result.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));
            
            return next(new AppError('Ошибка валидации', errors));
        }

        req[source] = result.data;
        next();
    };
};

/**
 * @param {import('zod').ZodSchema} schema - Zod-схема для валидации
 * @returns {Function} Express middleware
 */
export const validateResponse = (schema) => {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);
        
        res.json = (body) => {
            if (res.statusCode >= 400) {
                return originalJson(body);
            }
            
            try {
                schema.parse(body);
            } catch (error) {
                return next(error);
            }
            return originalJson(body);
        };
        
        next();
    };
};