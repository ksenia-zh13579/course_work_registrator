import { z, idParamsSchema, errorResponseSchema } from "../../validators/index.js";
import { registry } from "../openapi.js";
import { 
    getIncidentsQuerySchema, 
    createIncidentSchema, 
    updateIncidentSchema, 
    incidentSchema 
} from "../../validators/incidentsValidator.js";

registry.registerPath({
    method: 'get',
    path: '/api/incidents',
    summary: 'Получить список происшествий',
    tags: ['Incidents'],
    security: [],
    request: {
        query: getIncidentsQuerySchema
    },
    responses: {
        200: {
            description: 'Массив происшествий',
            content: {
                'application/json': {
                    schema: z.object({ data: z.array(incidentSchema) }),
                },
            },
        },
        404: { 
            description: 'В данном временном промежутке происшествий не найдено.' ,
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
    path: '/api/incidents',
    summary: 'Добавление нового происшествия',
    tags: ['Incidents'],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            required: true,
            content: {
                'application/json': { schema: createIncidentSchema },
            },
        },
    },
    responses: {
        201: { 
            description: 'Происшествие добавлено',
            content: {
                'application/json': {
                    schema: z.object({ data: incidentSchema }),
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
    path: '/api/incidents/{id}',
    summary: 'Обновление происшествия',
    tags: ['Incidents'],
    request: {
        params: idParamsSchema,
        body: {
            required: true,
            content: { 'application/json': { schema: updateIncidentSchema } },
        },
    },
    responses: {
        200: {
            description: 'Обновлённое происшествие',
            content: { 'application/json': { schema: z.object({ data: incidentSchema }) } },
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
            description: 'Происшествие не найдено', 
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
    path: '/api/incidents/{id}',
    summary: 'Удаление происшествия',
    tags: ['Incidents'],
    request: {
        params: idParamsSchema,
    },
    responses: {
        204: {
            description: 'Происшествие удалёно',
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
            description: 'Происшествие не найдено',
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    },
});