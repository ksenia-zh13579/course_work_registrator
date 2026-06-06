import { z } from 'zod';

export const searchParticipantsQuerySchema = z.object({
    q: z.string().trim(),
});

/*
export const getParticipantsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});
*/

export const createParticipantSchema = z.object({
    surname: z.string(),
    name: z.string(),
    patronymic: z.string().optional(),
    address: z.string(),
    crimial_records: z.number().int().nonnegative('Количество судимостей должно быть неотрицательным числом')
});

export const updateParticipantSchema = z.object({
    surname: z.string().optional(),
    name: z.string().optional(),
    patronymic: z.string().optional(),
    address: z.string().optional(),
    crimial_records: z.number().int().nonnegative('Количество судимостей должно быть неотрицательным числом').optional()
}).refine((data) => Object.keys(data).length > 0, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});

export const participantSchema = z.object({
    participant_id: z.number().int().positive(),
    surname: z.string(),
    name: z.string(),
    patronymic: z.string().optional(),
    address: z.string(),
    crimial_records: z.number().int().nonnegative('Количество судимостей должно быть неотрицательным числом')
});

export const getParticipantsResponseSchema = z.array(participantSchema);