import { getPasswordHash, verifyPassword } from '../../../utils/passwordActions.js';

describe('passwordActions', () => {
    const plainPassword = 'testPassword123';

    test('getPasswordHash должен возвращать хэш', async () => {
        const hash = await getPasswordHash(plainPassword, 10);
        expect(hash).toBeDefined();
        expect(typeof hash).toBe('string');
        expect(hash).not.toBe(plainPassword);
    });

    test('verifyPassword должен возвращать true для корректного пароля', async () => {
        const hash = await getPasswordHash(plainPassword, 10);
        const result = await verifyPassword(plainPassword, hash);
        expect(result).toBe(true);
    });

    test('verifyPassword должен возвращать false для неверного пароля', async () => {
        const hash = await getPasswordHash(plainPassword, 10);
        const result = await verifyPassword('wrongPassword', hash);
        expect(result).toBe(false);
    });
});