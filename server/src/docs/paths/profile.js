import { registry } from "../openapi.js";
import { z, errorResponseSchema } from "../../validators/index.js";
import { 
    redactProfileSchema, 
    profileResponseSchema 
} from "../../validators/profileValidator.js";

registry.registerPath({
    method: 'get',
    path: '/api/profile',
    summary: 'Получение информации о профиле пользователя',
    tags: ['Profile'],
    responses: {
        200: {
            description: 'Информация о профиле пользователя',
            content: {
                'application/json': {
                    schema: z.object({ data: z.array(profileResponseSchema) }),
                },
            },
        },
        401: { 
            description: 'Доступ запрещён' ,
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
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

registry.registerPath({
    method: 'patch',
    path: '/api/profile',
    summary: 'Обновление информации о профиле пользователя',
    tags: ['Profile'],
    request: {
        body: {
            required: true,
            content: { 'application/json': { schema: redactProfileSchema } },
        },
    },
    responses: {
        200: {
            description: 'Обновлённая информация о профиле пользователя',
            content: { 'application/json': { schema: z.object({ data: profileResponseSchema }) } },
        },
        400: { description: 'Ошибка валидации' },
        401: { 
            description: 'Неверный прежний пароль!', 
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
        403: { 
            description: 'Требуется авторизация' ,
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
        409: { 
            description: 'Такое имя пользователя уже занято!', 
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    },
});