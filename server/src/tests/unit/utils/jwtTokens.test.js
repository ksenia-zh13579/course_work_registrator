import jwt from 'jsonwebtoken';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from '../../../utils/jwtTokens.js';

jest.mock('jsonwebtoken');
jest.mock('crypto', () => ({
    randomUUID: () => 'mock-uuid-123',
}));

describe('jwtTokens', () => {
    const userId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('generateAccessToken должен вызывать jwt.sign с правильными параметрами', () => {
        jwt.sign.mockReturnValue('mockAccessToken');
        const token = generateAccessToken(userId);
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId },
            expect.any(String),
            { expiresIn: expect.any(String) }
        );
        expect(token).toBe('mockAccessToken');
    });

    test('generateRefreshToken должен возвращать объект с токеном, jti и expiresInMs', () => {
        jwt.sign.mockReturnValue('mockRefreshToken');
        const result = generateRefreshToken(userId);
        expect(result).toEqual({
            token: 'mockRefreshToken',
            jti: 'mock-uuid-123',
            expiresInMs: expect.any(Number),
        });
    });

    test('verifyAccessToken должен вызывать jwt.verify', () => {
        jwt.verify.mockReturnValue({ userId });
        const payload = verifyAccessToken('token');
        expect(jwt.verify).toHaveBeenCalledWith('token', expect.any(String));
        expect(payload).toEqual({ userId });
    });

    test('verifyRefreshToken должен вызывать jwt.verify', () => {
        jwt.verify.mockReturnValue({ userId, jti: 'mock-uuid' });
        const payload = verifyRefreshToken('token');
        expect(jwt.verify).toHaveBeenCalledWith('token', expect.any(String));
        expect(payload).toEqual({ userId, jti: 'mock-uuid' });
    });
});