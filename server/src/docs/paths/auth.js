import { registry } from "../openapi.js";
import { 
    registerSchema, 
    loginSchema, 
    loginAndRegisterResponseSchema 
} from "../../validators/authValidator.js";
import { z, errorResponseSchema } from '../../validators/index.js';

registry.registerPath({
    method: 'post',
    path: '/api/auth/register',
    summary: 'Регистрация пользователя в системе',
    tags: ['Authentification'],
    security: [],
    request: {
        body: {
            required: true,
            content: {
                'application/json': { schema: registerSchema },
            },
        },
    },
    responses: {
        201: { 
            description: 'Новый пользователь зарегистрирован',
            content: {
                'application/json': {
                    schema: loginAndRegisterResponseSchema
                },
            },
        },
        400: { description: 'Ошибка валидации' },
        409: { 
            description: 'Пользователь с таким именем пользователя уже существует' ,
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    },
});

registry.registerPath({
    method: 'post',
    path: '/api/auth/login',
    summary: 'Вход пользователя в систему',
    tags: ['Authentification'],
    security: [],
    request: {
        body: {
            required: true,
            content: {
                'application/json': { schema: loginSchema },
            },
        },
    },
    responses: {
        200: { 
            description: 'Успешно выполнен вход в систему',
            content: {
                'application/json': {
                    schema: loginAndRegisterResponseSchema
                },
            },
        },
        400: { description: 'Ошибка валидации' },
        401: { 
            description: 'Неверное имя пользователя или пароль' ,
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    },
});

registry.registerPath({
    method: 'post',
    path: '/api/auth/refresh',
    summary: 'Замена refresh-токена',
    tags: ['Authentification'],
    security: [],
    parameters: [
        {
            in: 'cookie',
            name: 'refreshToken',
            required: true,
            schema: {
                type: 'string',
            },
            description: 'JWT refresh‑токен',
            example: 'eyJhbGciOiJIUzI1NiIs...',
        },
    ],
    responses: {
        200: { 
            description: 'Успешно выполнен вход в систему',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['accessToken'],
                        properties: {
                            accessToken: {
                                type: 'string',
                                description: 'JWT access‑токен',
                                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                            },
                        },
                    },
                },
            },
        },
        400: { description: 'Ошибка валидации' },
        401: { 
            description: 'Refresh-токен отсутствует, недействителен или истёк' ,
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    },
});

registry.registerPath({
    method: 'delete',
    path: '/api/auth/logout',
    summary: 'Выход пользователя из системы',
    tags: ['Authentification'],
    parameters: [
        {
            in: 'cookie',
            name: 'refreshToken',
            required: true,
            schema: {
                type: 'string',
            },
            description: 'JWT refresh‑токен',
            example: 'eyJhbGciOiJIUzI1NiIs...',
        },
    ],
    responses: {
        200: { 
            description: 'Успешный выход из системы',
            content: { 
                'application/json': { schema: z.object({ message: z.string() }) } 
            },
        },
        400: { description: 'Ошибка валидации' },
        403: { 
            description: 'Требуется авторизация' ,
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    },
});