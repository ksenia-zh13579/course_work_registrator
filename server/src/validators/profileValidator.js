import { z, iso } from 'zod';
import { Role } from '@prisma/client';

export const redactProfileSchema = z.object({
    username: z.string().min(2).max(50).optional(),
    name: z.string().optional(),
    surname: z.string().optional(),
    patronymic: z.string().optional(),
    old_password: z.string().min(6).max(100),
    new_password: z.string().min(6).max(100).optional()
}).refine((data) => Object.keys(data).length > 1, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});

export const profileResponseSchema = z.object({
    user_id: z.number().int().positive(),
    username: z.string().min(2).max(50),
    name: z.string(),
    surname: z.string(),
    patronymic: z.string().optional(),
    role: z.enum(Role),
    updatedAt: z.iso().datetime(),
});