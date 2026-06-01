import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
    username: z.string().min(2).max(50),
    name: z.string(),
    surname: z.string(),
    patronymic: z.string().optional(),
    password: z.string().min(6).max(100)
});

export const loginSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(6).max(100)
});

export const loginAndRegisterResponseSchema = z.object({
    accessToken: z.string(),
    user: z.object({
        id: z.number().int().positive(),
        username: z.string().min(2).max(50),
        role: z.enum(Role)
    })
});