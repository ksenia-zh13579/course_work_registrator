import { registry } from "../openapi";
import { idParamsSchema } from '../../validators/index.js';
import { errorResponseSchema } from "../../validators/index.js";
import { 
    searchParticipantsQuerySchema, 
    createParticipantSchema,
    updateParticipantSchema,
    participantSchema
} from "../../validators/participantsValidator.js";

registry.registerPath({
    method: 'get',
    path: '/api/participants',
    summary: 'Получить список участников происшествий',
    tags: ['Participants'],
    responses: {
        200: {
            description: 'Массив участников происшествий',
            content: {
                'application/json': {
                    schema: z.object({ data: z.array(participantSchema) }),
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
        404: { 
            description: 'Пока не добавлено ни одного участника происшествий.' ,
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
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

registry.registerPath({
    method: 'get',
    path: '/api/participants/search',
    summary: 'Поиск участников происшествий по имени',
    tags: ['Participants'],
    request: {
        query: searchParticipantsQuerySchema
    },
    responses: {
        200: {
            description: 'Массив подходящих участников происшествий',
            content: {
                'application/json': {
                    schema: z.object({ data: z.array(participantSchema) }),
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
        404: { 
            description: 'По данному запросу ничего не найдено.' ,
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
    path: '/api/participants',
    summary: 'Добавление нового участника',
    tags: ['Participants'],
    request: {
        body: {
            required: true,
            content: {
                'application/json': { schema: createParticipantSchema },
            },
        },
    },
    responses: {
        201: { 
            description: 'Новый участник добавлен',
            content: {
                'application/json': {
                    schema: z.object({ data: participantSchema }),
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
    path: '/api/participants/{id}',
    summary: 'Обновление информации об участнике',
    tags: ['Participants'],
    request: {
        params: idParamsSchema,
        body: {
            required: true,
            content: { 'application/json': { schema: updateParticipantSchema } },
        },
    },
    responses: {
        200: {
            description: 'Обновлённая информация об участнике',
            content: { 'application/json': { schema: z.object({ data: participantSchema }) } },
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
            description: 'Участник не найден', 
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
    path: '/api/participants/{id}',
    summary: 'Удаление происшествия',
    tags: ['Participants'],
    request: {
        params: idParamsSchema,
    },
    responses: {
        204: {
            description: 'информация об участнике удалена',
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
            description: 'Участник не найден',
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    },
});