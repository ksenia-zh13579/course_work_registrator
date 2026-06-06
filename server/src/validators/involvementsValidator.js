import { z, iso } from 'zod';
import { InvStatus } from '@prisma/client';

export const searchInvolvementsQuerySchema = z.object({
    q: z.string().trim(),
});

export const createInvolvementSchema = z.object({
    participant_id: z.number().int().positive('ID участника должен быть положительным'),
    incident_id: z.number().int().positive('ID происшествия должен быть положительным'),
    status: z.enum(InvStatus),
});

export const updateInvolvementSchema = z.object({
    participant_id: z.number().int().positive('ID участника должен быть положительным').optional(),
    incident_id: z.number().int().positive('ID происшествия должен быть положительным').optional(),
    status: z.enum(InvStatus).optional(),
}).refine((data) => Object.keys(data).length > 0, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});

export const involvementSchema = z.object({
    involvement_id: z.number().int().positive(),
    incident_id: z.number().int().positive(),
    incident_date: z.iso().datetime(),
    incident_type: z.string(),
    participant_id: z.number().int().positive(),
    participant_full_name: z.string(),
    status: z.enum(InvStatus)
});

export const getInvolvementsResponseSchema = z.array(involvementSchema);