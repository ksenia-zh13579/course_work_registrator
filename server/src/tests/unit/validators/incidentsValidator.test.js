import {
    getIncidentsQuerySchema,
    createIncidentSchema,
    updateIncidentSchema,
} from '../../../validators/incidentsValidator.js';

describe('Incidents Validators', () => {
    describe('getIncidentsQuerySchema', () => {
        test('должен валидировать корректные даты', () => {
            const data = {
                startDate: '2023-01-01',
                endDate: '2023-12-31',
            };
            const result = getIncidentsQuerySchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        test('должен преобразовывать строки в Date', () => {
            const data = { startDate: '2023-01-01' };
            const result = getIncidentsQuerySchema.safeParse(data);
            expect(result.success).toBe(true);
            expect(result.data.startDate).toBeInstanceOf(Date);
        });

        test('должен отклонять endDate раньше startDate', () => {
            const data = {
                startDate: '2023-12-31',
                endDate: '2023-01-01',
            };
            const result = getIncidentsQuerySchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });

    describe('createIncidentSchema', () => {
        test('должен валидировать корректные данные', () => {
            const data = {
                date: '2025-05-01',
                incident_type_id: 1,
                description: 'Описание',
            };
            const result = createIncidentSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        test('должен устанавливать incident_status_id по умолчанию в 1', () => {
            const data = {
                date: '2025-05-01',
                incident_type_id: 1,
            };
            const result = createIncidentSchema.safeParse(data);
            expect(result.success).toBe(true);
            expect(result.data.incident_status_id).toBe(1);
        });
    });

    describe('updateIncidentSchema', () => {
        test('должен валидировать обновление с одним полем', () => {
            const data = { description: 'Новое описание' };
            const result = updateIncidentSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        test('должен отклонять, если нет полей', () => {
            const data = {};
            const result = updateIncidentSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });
});