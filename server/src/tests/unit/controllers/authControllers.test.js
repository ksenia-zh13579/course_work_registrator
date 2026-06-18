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
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        },
    },
}));

// КРИТИЧЕСКИ ВАЖНО: Мокаем asyncHandler, чтобы он возвращал Promise
// Иначе тесты не будут ждать завершения асинхронных операций в контроллерах
jest.mock('../../../utils/asyncHandler.js', () => ({
    asyncHandler: (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next),
}));

describe('Auth Controllers', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {},
            cookies: {},
        };
        res = {
            cookie: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
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

            await login(req, res, next);

            expect(next).not.toHaveBeenCalled();
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

            await login(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 401,
                    message: 'Неверное имя пользователя или пароль',
                })
            );
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
            
            // prisma.user.create уже является jest.fn() благодаря блоку jest.mock в начале файла
            prisma.user.create.mockResolvedValue({
                user_id: 1,
                username: 'newuser',
                role: 'VIEWER',
            });
            prisma.refreshToken.create.mockResolvedValue({});

            await register(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.cookie).toHaveBeenCalledWith(
                'refreshToken',
                'refreshToken',
                expect.objectContaining({ httpOnly: true })
            );
            expect(res.json).toHaveBeenCalledWith({
                accessToken: 'accessToken',
                user: { id: 1, username: 'newuser', role: 'VIEWER' },
            });
        });

        test('должен выбросить ошибку при существующем пользователе', async () => {
            req.body = { username: 'existing', surname: 'Иванов', name: 'Иван', password: 'pass123' };
            getUserByUsername.mockResolvedValue({ user_id: 1 });

            await register(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 409,
                    message: 'Пользователь с таким именем пользователя уже существует',
                })
            );
        });
    });

    describe('refresh', () => {
        test('должен успешно обновить токен', async () => {
            req.cookies = { refreshToken: 'validRefreshToken' };
            
            // 1. Мок проверки токена
            verifyRefreshToken.mockReturnValue({ jti: 'jti123', userId: 1 });
            
            // 2. Мок поиска токена в БД (ВАЖНО: добавлены id и user_id)
            prisma.refreshToken.findUnique.mockResolvedValue({
                id: 10, 
                token: 'jti123',
                expiresAt: new Date(Date.now() + 10000),
                user_id: 1, 
                user: { user_id: 1 },
            });
            
            // 3. Мок удаления старого токена
            prisma.refreshToken.delete.mockResolvedValue({});
            
            // 4. Мок генерации новой пары токенов
            generateRefreshToken.mockReturnValue({ 
                token: 'newRefreshToken', 
                jti: 'newJti', 
                expiresInMs: 600000 
            });
            
            // 5. Мок сохранения нового токена в БД
            prisma.refreshToken.create.mockResolvedValue({});
            
            // 6. Мок генерации нового access токена
            generateAccessToken.mockReturnValue('newAccessToken');

            await refresh(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.cookie).toHaveBeenCalledWith(
                'refreshToken',
                'newRefreshToken',
                expect.objectContaining({ httpOnly: true })
            );
            expect(res.json).toHaveBeenCalledWith({ accessToken: 'newAccessToken' });
        });

        test('должен выбросить ошибку при отсутствии refresh токена', async () => {
            req.cookies = {};

            await refresh(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 401,
                    message: 'Refresh-токен отсутствует',
                })
            );
        });
    });
});