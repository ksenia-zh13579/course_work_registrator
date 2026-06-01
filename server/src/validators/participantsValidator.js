import { z } from 'zod';

export const getParticipantsQuerySchema = z.object({
    full_name: z.string().optional(),
});

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
