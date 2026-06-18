import {
    createParticipantSchema,
    updateParticipantSchema,
} from '../../../validators/participantsValidator.js';

describe('Participants Validators', () => {
    describe('createParticipantSchema', () => {
        test('должен валидировать корректные данные', () => {
            const data = {
                surname: 'Иванов',
                name: 'Иван',
                patronymic: 'Иванович',
                address: 'ул. Ленина, д. 10',
                crimial_records: 0,
            };
            const result = createParticipantSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        test('patronymic должен быть опциональным', () => {
            const data = {
                surname: 'Иванов',
                name: 'Иван',
                address: 'ул. Ленина, д. 10',
                crimial_records: 0,
            };
            const result = createParticipantSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        test('должен отклонять отрицательное crimial_records', () => {
            const data = {
                surname: 'Иванов',
                name: 'Иван',
                address: 'ул. Ленина, д. 10',
                crimial_records: -1,
            };
            const result = createParticipantSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });

    describe('updateParticipantSchema', () => {
        test('должен валидировать обновление с одним полем', () => {
            const data = { surname: 'Петров' };
            const result = updateParticipantSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        test('должен отклонять, если нет полей', () => {
            const data = {};
            const result = updateParticipantSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });
});