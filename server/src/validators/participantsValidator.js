import { z } from 'zod';

export const searchParticipantsQuerySchema = z.object({
    q: z.string().trim().openapi({ example: 'Иванов Н А' }),
});

/*
export const getParticipantsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});
*/

export const createParticipantSchema = z.object({
    surname: z.string().openapi({ example: 'Иванов' }),
    name: z.string().openapi({ example: 'Иван' }),
    patronymic: z.string().optional().openapi({ example: 'Иванович' }),
    address: z.string().openapi({ example: 'ул. Ленина, д. 10, кв. 5' }),
    crimial_records: z.number().int().nonnegative('Количество судимостей должно быть неотрицательным числом').openapi({ example: '0' })
});

export const updateParticipantSchema = z.object({
    surname: z.string().optional().openapi({ example: 'Иванов' }),
    name: z.string().optional().openapi({ example: 'Иван' }),
    patronymic: z.string().optional().openapi({ example: 'Иванович' }),
    address: z.string().optional().openapi({ example: 'ул. Ленина, д. 10, кв. 5' }),
    crimial_records: z.number().int().nonnegative('Количество судимостей должно быть неотрицательным числом').optional().openapi({ example: '0' })
}).refine((data) => Object.keys(data).length > 0, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});

export const participantSchema = z.object({
    participant_id: z.number().int().positive().openapi({ example: '1' }),
    surname: z.string().openapi({ example: 'Иванов' }),
    name: z.string().openapi({ example: 'Иван' }),
    patronymic: z.string().optional().openapi({ example: 'Иванович' }),
    address: z.string().openapi({ example: 'ул. Ленина, д. 10, кв. 5' }),
    crimial_records: z.number().int().nonnegative('Количество судимостей должно быть неотрицательным числом').openapi({ example: '0' })
});

// export const getParticipantsResponseSchema = z.array(participantSchema);