import { z } from 'zod';
import { InvStatus } from '@prisma/client';

export const getInvolvementsQuerySchema = z.object({
    full_name: z.string().optional(),
});

export const createInvolvementSchema = z.object({
    participant_id: z.number().int().positive('ID участника должен быть положительным'),
    incident_id: z.number().int().positive('ID происшествия должен быть положительным'),
    status: z.enum(InvStatus),
});

export const updateInvolvementSchema = z.object({
    participant_id: z.number().int().positive('ID участника должен быть положительным').optional(),
    incident_id: z.number().int().positive('ID происшествия должен быть положительным').optional(),
    status: z.nativeEnum(InvStatus).optional(),
}).refine((data) => Object.keys(data).length > 0, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});
