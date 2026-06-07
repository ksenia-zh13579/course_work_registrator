import { registry } from "../openapi";
import { 
    registerSchema, 
    loginSchema, 
    loginAndRegisterResponseSchema 
} from "../../validators/authValidator";
import { errorResponseSchema } from '../validators/index.js';

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
        409: { description: 'Пользователь с таким именем пользователя уже существует' },
        400: { description: 'Ошибка валидации' },
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
        401: { description: 'Неверное имя пользователя или пароль' },
        400: { description: 'Ошибка валидации' },
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
        401: { description: 'Refresh-токен отсутствует' },
        401: { description: 'Refresh-токен недействителен или истёк' },
        400: { description: 'Ошибка валидации' },
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
        204: { 
            description: 'Успешный выход из системы',
            content: { 
                'application/json': { schema: z.object({ message: z.string() }) } 
            },
        },
    },
});