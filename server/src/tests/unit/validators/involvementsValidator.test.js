import {
    createInvolvementSchema,
    updateInvolvementSchema,
} from '../../../validators/involvementsValidator.js';

describe('Involvements Validators', () => {
    describe('createInvolvementSchema', () => {
        test('должен валидировать корректные данные', () => {
            const data = {
                participant_id: 1,
                incident_id: 1,
                status: 'SUSPECT',
            };
            const result = createInvolvementSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        test('должен отклонять невалидный статус', () => {
            const data = {
                participant_id: 1,
                incident_id: 1,
                status: 'INVALID_STATUS',
            };
            const result = createInvolvementSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });

    describe('updateInvolvementSchema', () => {
        test('должен валидировать обновление с одним полем', () => {
            const data = { status: 'VICTIM' };
            const result = updateInvolvementSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        test('должен отклонять, если нет полей', () => {
            const data = {};
            const result = updateInvolvementSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });
});