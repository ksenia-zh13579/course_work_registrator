import { z } from './index.js';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
    username: z.string().min(2).max(50).openapi({ example: 'user123' }),
    name: z.string().openapi({ example: 'Анастасия' }),
    surname: z.string().openapi({ example: 'Смирнова' }),
    patronymic: z.string().optional().openapi({ example: 'Николаевна' }),
    password: z.string().min(6).max(100).openapi({ example: 'password123' })
});

export const loginSchema = z.object({
    username: z.string().min(2).max(50).openapi({ example: 'user123' }),
    password: z.string().min(6).max(100).openapi({ example: 'password123' })
});

export const loginAndRegisterResponseSchema = z.object({
    accessToken: z.jwt().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBdXRoIFNlcnZlciIsInN1YiI6ImF1dGgiLCJleHAiOjE1MDU0Njc3NTY4NjksImlhdCI6MTUwNTQ2NzE1MjA2OSwidXNlciI6MX0.9VPGwNXYfXnNFWH3VsKwhFJ0MazwmNvjSSRZ1vf3ZUU' }),
    user: z.object({
        id: z.number().int().positive().openapi({ example: '123' }),
        username: z.string().min(2).max(50).openapi({ example: 'user123' }),
        role: z.enum(Role).openapi({ example: 'VIEWER' })
    })
});
