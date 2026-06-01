import { z } from 'zod';

export const getIncidentsSchema = z.object({
    startDate: z.string().datetime('Дата должна быть в формате ISO 8601').optional(),
    endDate: z.string().datetime('Дата должна быть в формате ISO 8601').optional()
}).refine((data) => Object.keys(data).length > 0 && (!data.startDate || !data.endDate || data.startDate <= data.endDate), {
    message: 'Конечная дата промежутка не должна быть больше начальной'
});

export const createIncidentSchema = z.object({
    date: z.string().datetime('Дата должна быть в формате ISO 8601'),
    incident_type: z.string(),
    description: z.string().nullable().optional(),
    incident_status: z.string(),
    reg_number: z.string().nullable().optional(),
});

export const updateIncidentSchema = z.object({
    date: z.string().datetime('Дата должна быть в формате ISO 8601').optional(),
    incident_type: z.string(),
    description: z.string().nullable().optional(),
    incident_status: z.string(),
    reg_number: z.string().nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});

export const IncidentSchema = z.object({
    id: z.number().int().positive(),
    date: z.string().datetime(),
    incident_type_id: z.number().int().positive(),
    incident_type: z.string(),
    description: z.string().nullable().optional(),
    incident_status_id: z.number().int().positive(),
    incident_status: z.string(),
    reg_number: z.string().nullable().optional(),
});

export const getIncidentsResponseSchema = z.array(IncidentSchema);
