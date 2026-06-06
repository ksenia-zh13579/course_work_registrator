import { z, iso } from 'zod';

export const getIncidentsQuerySchema = z.object({
    startDate: z.iso().datetime('Дата должна быть в формате ISO 8601').optional(),
    endDate: z.iso().datetime('Дата должна быть в формате ISO 8601').optional(),
}).refine((data) => Object.keys(data).length > 0 && (!data.startDate || !data.endDate || data.startDate <= data.endDate), {
    message: 'Конечная дата промежутка не должна быть больше начальной'
});

export const createIncidentSchema = z.object({
    date: z.iso().datetime('Дата должна быть в формате ISO 8601'),
    incident_type_id: z.number().int().positive(),
    description: z.string().nullable().optional(),
    incident_status_id: z.number().int().positive().default(1),
    reg_number: z.string().nullable().optional(),
});

export const updateIncidentSchema = z.object({
    date: z.iso().datetime('Дата должна быть в формате ISO 8601').optional(),
    incident_type_id: z.number().int().positive().optional(),
    description: z.string().nullable().optional(),
    incident_status_id: z.number().int().positive().optional(),
    reg_number: z.string().nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});

export const IncidentSchema = z.object({
    incident_id: z.number().int().positive(),
    date: z.iso().datetime(),
    incident_type: z.string(),
    description: z.string().nullable().optional(),
    incident_status: z.string(),
    reg_number: z.string().nullable().optional(),
});

export const getIncidentsResponseSchema = z.array(IncidentSchema);
