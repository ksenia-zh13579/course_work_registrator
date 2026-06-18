import { registerSchema, loginSchema } from '../../../validators/authValidator.js';

describe('Auth Validators', () => {
    describe('registerSchema', () => {
        test('должен валидировать корректные данные', () => {
            const validData = {
                username: 'user123',
                name: 'Анастасия',
                surname: 'Смирнова',
                patronymic: 'Николаевна',
                password: 'password123',
            };
            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        test('должен отклонять username короче 2 символов', () => {
            const invalidData = {
                username: 'u',
                name: 'Анастасия',
                surname: 'Смирнова',
                password: 'password123',
            };
            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        test('должен отклонять password короче 6 символов', () => {
            const invalidData = {
                username: 'user123',
                name: 'Анастасия',
                surname: 'Смирнова',
                password: '12345',
            };
            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        test('patronymic должен быть опциональным', () => {
            const dataWithoutPatronymic = {
                username: 'user123',
                name: 'Анастасия',
                surname: 'Смирнова',
                password: 'password123',
            };
            const result = registerSchema.safeParse(dataWithoutPatronymic);
            expect(result.success).toBe(true);
        });
    });

    describe('loginSchema', () => {
        test('должен валидировать корректные данные', () => {
            const validData = {
                username: 'user123',
                password: 'password123',
            };
            const result = loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        test('должен отклонять отсутствие username', () => {
            const invalidData = { password: 'password123' };
            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
});