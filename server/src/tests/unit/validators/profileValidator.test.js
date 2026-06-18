import { redactProfileSchema } from '../../../validators/profileValidator.js';

describe('Profile Validator', () => {
    test('должен валидировать обновление с одним полем', () => {
        const data = { username: 'newuser', old_password: 'oldPass123' };
        const result = redactProfileSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    test('должен валидировать обновление с несколькими полями', () => {
        const data = {
            username: 'newuser',
            surname: 'Петров',
            name: 'Петр',
            old_password: 'oldPass123',
            new_password: 'newPass123',
        };
        const result = redactProfileSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    test('должен отклонять, если нет полей для обновления', () => {
        const data = { old_password: 'oldPass123' };
        const result = redactProfileSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Должно быть хотя бы одно поле для обновления');
    });

    test('должен отклонять new_password короче 6 символов', () => {
        const data = {
            username: 'newuser',
            old_password: 'oldPass123',
            new_password: '12345',
        };
        const result = redactProfileSchema.safeParse(data);
        expect(result.success).toBe(false);
    });
});