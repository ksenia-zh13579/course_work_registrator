import { z, iso } from 'zod';
import { InvStatus } from '@prisma/client';

export const searchInvolvementsQuerySchema = z.object({
    q: z.string().trim().openapi({ example: 'Иванов Н А' }),
});

export const createInvolvementSchema = z.object({
    participant_id: z.number().int().positive('ID участника должен быть положительным').openapi({ example: '1' }),
    incident_id: z.number().int().positive('ID происшествия должен быть положительным').openapi({ example: '1' }),
    status: z.enum(InvStatus).openapi({ example: 'SUSPECT' }),
});

export const updateInvolvementSchema = z.object({
    participant_id: z.number().int().positive('ID участника должен быть положительным').optional().openapi({ example: '1' }),
    incident_id: z.number().int().positive('ID происшествия должен быть положительным').optional().openapi({ example: '1' }),
    status: z.enum(InvStatus).optional().openapi({ example: 'SUSPECT' }),
}).refine((data) => Object.keys(data).length > 0, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});

export const involvementSchema = z.object({
    involvement_id: z.number().int().positive().openapi({ example: '123' }),
    incident_id: z.number().int().positive().openapi({ example: '1' }),
    incident_date: z.iso.date('Дата должна быть в формате ISO 8601').openapi({ example: '2023-01-01' }),
    incident_type: z.string().openapi({ example: 'Нападение' }),
    participant_id: z.number().int().positive().openapi({ example: '1' }),
    participant_full_name: z.string().openapi({ example: 'Иванов Н. А.' }),
    status: z.enum(InvStatus).openapi({ example: 'SUSPECT' })
});

// export const getInvolvementsResponseSchema = z.array(involvementSchema);