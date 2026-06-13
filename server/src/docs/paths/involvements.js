import { registry } from "../openapi.js";
import { z, idParamsSchema, errorResponseSchema } from '../../validators/index.js';
import {
    searchInvolvementsQuerySchema,
    createInvolvementSchema,
    updateInvolvementSchema,
    involvementSchema
} from "../../validators/involvementsValidator.js";

registry.registerPath({
    method: 'get',
    path: '/api/involvements',
    summary: 'Получить список статусов участников происшествий',
    tags: ['Involvements'],
    security: [],
    responses: {
        200: {
            description: 'Массив статусов участников происшествий',
            content: {
                'application/json': {
                    schema: z.object({ data: z.array(involvementSchema) }),
                },
            },
        },
        404: { 
            description: 'Пока не добавлено ни одного статуса для участников происшествий.' ,
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
        400: { description: 'Ошибка валидации' },
    },
});

registry.registerPath({
    method: 'get',
    path: '/api/involvements/search',
    summary: 'Поиск статусов участников происшествий',
    tags: ['Involvements'],
    security: [],
    request: {
        query: searchInvolvementsQuerySchema
    },
    responses: {
        200: {
            description: 'Массив подходящих статусов участников происшествий',
            content: {
                'application/json': {
                    schema: z.object({ data: z.array(involvementSchema) }),
                },
            },
        },
        404: { 
            description: 'По данному запросу ничего не найдено.' ,
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
        400: { description: 'Ошибка валидации' },
    },
});

registry.registerPath({
    method: 'post',
    path: '/api/involvements',
    summary: 'Добавление нового статуса участника происшествия',
    tags: ['Involvements'],
    request: {
        body: {
            required: true,
            content: {
                'application/json': { schema: createInvolvementSchema },
            },
        },
    },
    responses: {
        201: { 
            description: 'Статус добавлен',
            content: {
                'application/json': {
                    schema: z.object({ data: involvementSchema }),
                },
            },
        },
        400: { description: 'Ошибка валидации' },
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
    path: '/api/involvements/{id}',
    summary: 'Обновление статуса участника происшествия',
    tags: ['Involvements'],
    request: {
        params: idParamsSchema,
        body: {
            required: true,
            content: { 'application/json': { schema: updateInvolvementSchema } },
        },
    },
    responses: {
        200: {
            description: 'Обновлённый статус участника происшествия',
            content: { 'application/json': { schema: z.object({ data: involvementSchema }) } },
        },
        400: { description: 'Ошибка валидации' },
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
        404: { 
            description: 'Статус участника не найден', 
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
    path: '/api/involvements/{id}',
    summary: 'Удаление статуса участника происшествия',
    tags: ['Involvements'],
    request: {
        params: idParamsSchema,
    },
    responses: {
        204: {
            description: 'Статус участника происшествия удалён',
            content: { 'application/json': { schema: z.object({ message: z.string() }) } },
        },
        400: { description: 'Ошибка валидации' },
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
        404: { 
            description: 'Статус участника не найден',
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    },
});