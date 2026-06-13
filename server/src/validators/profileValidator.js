import { iso } from 'zod';
import { z } from './index.js';
import { Role } from '@prisma/client';

export const redactProfileSchema = z.object({
    username: z.string().min(2).max(50).optional().openapi({ example: 'user123' }),
    surname: z.string().optional().openapi({ example: 'Иванов' }),
    name: z.string().optional().openapi({ example: 'Иван' }),
    patronymic: z.string().optional().openapi({ example: 'Иванович' }),
    old_password: z.string().min(6).max(100).openapi({ example: 'old_password123' }),
    new_password: z.string().min(6).max(100).optional().openapi({ example: 'new_password123' })
}).refine((data) => Object.keys(data).length > 1, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});

export const profileResponseSchema = z.object({
    user_id: z.number().int().positive().openapi({ example: '1' }),
    username: z.string().min(2).max(50).openapi({ example: 'user123' }),
    surname: z.string().openapi({ example: 'Иванов' }),
    name: z.string().openapi({ example: 'Иван' }),
    patronymic: z.string().optional().openapi({ example: 'Иванович' }),
    role: z.enum(Role).openapi({ example: 'VIEWER' }),
    updatedAt: z.iso.datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
});