import { iso } from 'zod';
import { z } from './index.js';

export const getIncidentsQuerySchema = z.object({
    startDate: z.preprocess(
        (val) => {
            if (typeof val === 'string' && val.trim() === '') return undefined;
            return val;
        }, 
        z.iso.date('Дата должна быть в формате ISO 8601').transform(val => new Date(val)).optional().openapi({ example: '2020-01-01' })
    ),
    endDate: z.preprocess(
        (val) => {
            if (typeof val === 'string' && val.trim() === '') return undefined;
            return val;
        }, 
        z.iso.date('Дата должна быть в формате ISO 8601').transform(val => new Date(val)).optional().openapi({ example: '2026-01-01' })
    ),
}).refine((data) => !data.startDate || !data.endDate || data.startDate <= data.endDate, {
    message: 'Конечная дата промежутка не должна быть больше начальной'
});

export const createIncidentSchema = z.object({
    date: z.iso.date('Дата должна быть в формате ISO 8601').transform(val => new Date(val)).openapi({ example: '2025-05-01' }),
    incident_type_id: z.number().int().positive().openapi({ example: '1' }),
    description: z.string().nullable().optional().openapi({ example: 'Описание происшествия' }),
    incident_status_id: z.number().int().positive().default(1).openapi({ example: '2' }),
    reg_number: z.string().nullable().optional().openapi({ example: 'АВ123456' }),
});

export const updateIncidentSchema = z.object({
    date: z.iso.date('Дата должна быть в формате ISO 8601').transform(val => new Date(val)).optional().openapi({ example: '2025-05-01' }),
    incident_type_id: z.number().int().positive().optional().openapi({ example: '1' }),
    description: z.string().nullable().optional().openapi({ example: 'Описание происшествия' }),
    incident_status_id: z.number().int().positive().optional().openapi({ example: '2' }),
    reg_number: z.string().nullable().optional().openapi({ example: 'АВ123456' }),
}).refine((data) => Object.keys(data).length > 0, { 
        message: 'Должно быть хотя бы одно поле для обновления' 
});

export const incidentSchema = z.object({
    incident_id: z.number().int().positive().openapi({ example: '1' }),
    date: z.iso.date('Дата должна быть в формате ISO 8601').transform(val => new Date(val)).openapi({ example: '2025-05-01' }),
    incident_type: z.string().openapi({ example: 'Кража' }),
    description: z.string().nullable().optional().openapi({ example: 'Описание происшествия' }),
    incident_status: z.string().openapi({ example: 'Отказано в возбуждении дела' }),
    reg_number: z.string().nullable().optional().openapi({ example: 'АВ123456' }),
});

// export const getIncidentsResponseSchema = z.array(incidentSchema);
