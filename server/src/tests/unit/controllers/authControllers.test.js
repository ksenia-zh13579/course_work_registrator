import { login, register, refresh } from '../../../controllers/authControllers.js';
import { verifyPassword, getPasswordHash } from '../../../utils/passwordActions.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../utils/jwtTokens.js';
import { getUserByUsername } from '../../../utils/BDgetters.js';
import { prisma } from '../../../client.js';

jest.mock('../../../utils/passwordActions.js');
jest.mock('../../../utils/jwtTokens.js');
jest.mock('../../../utils/BDgetters.js');
jest.mock('../../../client.js', () => ({
    prisma: {
        refreshToken: {
            create: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        },
    },
}));

describe('Auth Controllers', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {},
            cookies: {},
        };
        res = {
            cookie: jest.fn(),
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    describe('login', () => {
        test('должен успешно выполнить вход', async () => {
            const mockUser = {
                user_id: 1,
                username: 'user123',
                role: 'VIEWER',
                password_hash: 'hash',
            };
            req.body = { username: 'user123', password: 'pass123' };
            getUserByUsername.mockResolvedValue(mockUser);
            verifyPassword.mockResolvedValue(true);
            generateRefreshToken.mockReturnValue({ token: 'refreshToken', jti: 'jti123', expiresInMs: 600000 });
            generateAccessToken.mockReturnValue('accessToken');
            prisma.refreshToken.create.mockResolvedValue({});

            await login(req, res);

            expect(res.cookie).toHaveBeenCalledWith(
                'refreshToken',
                'refreshToken',
                expect.objectContaining({ httpOnly: true })
            );
            expect(res.json).toHaveBeenCalledWith({
                accessToken: 'accessToken',
                user: { id: 1, username: 'user123', role: 'VIEWER' },
            });
        });

        test('должен выбросить ошибку при неверном пароле', async () => {
            req.body = { username: 'user123', password: 'wrong' };
            getUserByUsername.mockResolvedValue({ user_id: 1, password_hash: 'hash' });
            verifyPassword.mockResolvedValue(false);

            await expect(login(req, res)).rejects.toThrow('Неверное имя пользователя или пароль');
        });
    });

    describe('register', () => {
        test('должен успешно зарегистрировать пользователя', async () => {
        req.body = {
            username: 'newuser',
            surname: 'Иванов',
            name: 'Иван',
            patronymic: 'Иванович',
            password: 'pass123',
        };
        getUserByUsername.mockResolvedValue(null);
        getPasswordHash.mockResolvedValue('hashed');
        generateRefreshToken.mockReturnValue({ token: 'refreshToken', jti: 'jti123', expiresInMs: 600000 });
        generateAccessToken.mockReturnValue('accessToken');
        prisma.user.create = jest.fn().mockResolvedValue({
            user_id: 1,
            username: 'newuser',
            role: 'VIEWER',
        });
        prisma.refreshToken.create.mockResolvedValue({});

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            accessToken: 'accessToken',
            user: { id: 1, username: 'newuser', role: 'VIEWER' },
        });
        });

        test('должен выбросить ошибку при существующем пользователе', async () => {
        req.body = { username: 'existing', surname: 'Иванов', name: 'Иван', password: 'pass' };
        getUserByUsername.mockResolvedValue({ user_id: 1 });

        await expect(register(req, res)).rejects.toThrow('Пользователь с таким именем пользователя уже существует');
        });
    });

    describe('refresh', () => {
        test('должен успешно обновить токен', async () => {
            req.cookies = { refreshToken: 'validRefreshToken' };
            verifyRefreshToken.mockReturnValue({ jti: 'jti123', userId: 1 });
            prisma.refreshToken.findUnique.mockResolvedValue({
                token: 'jti123',
                expiresAt: new Date(Date.now() + 10000),
                user: { user_id: 1 },
            });
            generateAccessToken.mockReturnValue('newAccessToken');

            await refresh(req, res);

            expect(res.json).toHaveBeenCalledWith({ accessToken: 'newAccessToken' });
        });

        test('должен выбросить ошибку при отсутствии refresh токена', async () => {
            req.cookies = {};

            await expect(refresh(req, res)).rejects.toThrow('Refresh-токен отсутствует');
        });
    });
});