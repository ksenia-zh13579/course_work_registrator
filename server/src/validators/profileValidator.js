import { z } from 'zod';

export const redactProfileSchema = z.object({
    username: z.string().min(2).max(50).optional(),
    name: z.string().optional(),
    surname: z.string().optional(),
    patronymic: z.string().optional(),
    password: z.string().min(6).max(100).optional()
}).refine((data) => Object.keys(data).length > 0, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});