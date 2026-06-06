import { verifyPassword, getPasswordHash } from '../utils/passwordActions.js';
import { getUserByUsername } from '../utils/BDgetters.js';
import { prisma } from '../client.js';
import { generateAccessToken, generateRefreshToken } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errors.js';

export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);
    if (!user) {
        throw new AppError(401, 'Неверное имя пользователя или пароль');
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
        throw new AppError(401, 'Неверное имя пользователя или пароль');
    }

    const { token: refreshToken, jti, expiresInMs } = generateRefreshToken(user.user_id);
    const expiresAt = new Date(Date.now() + expiresInMs);

    await prisma.refreshToken.create({
        data: {
            token: jti,
            userId: user.user_id,
            expiresAt,
        },
    });

    const accessToken = generateAccessToken(user.user_id);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: expiresInMs,
        path: '/api/auth', 
    });

    res.json({
        accessToken,
        user: {
            id: user.user_id,
            username: user.username,
            role: user.role,
        },
    });
});

export const register = asyncHandler(async (req, res) => {
    const { username, surname, name, patronymic, password } = req.body;

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        throw new AppError(409, 'Пользователь с таким именем уже существует');
    }

    const hashedPassword = await getPasswordHash(password, 10);

    const user = await prisma.user.create({
        data: {
        username,
        surname,
        name,
        patronymic,
        password_hash: hashedPassword,
        },
    });

    const { token: refreshToken, jti, expiresInMs } = generateRefreshToken(user.user_id);
    const expiresAt = new Date(Date.now() + expiresInMs);

    await prisma.refreshToken.create({
        data: {
            token: jti,
            userId: user.user_id,
            expiresAt,
        },
    });

    const accessToken = generateAccessToken(user.user_id);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: expiresInMs,
        path: '/api/auth', 
    });

    res.status(201).json({
        accessToken,
        user: { 
            id: user.user_id, 
            username: user.username, 
            role: user.role 
        },
    });
});

export const refresh = asyncHandler(async (req, res) => {
    const tokenFromCookie = req.cookies?.refreshToken;
    if (!tokenFromCookie) {
        throw new AppError(401, 'Refresh-токен отсутствует');
    }

    let payload;
    try {
        payload = verifyRefreshToken(tokenFromCookie);
    } catch (err) {
        throw new AppError(401, 'Refresh-токен недействителен или истёк');
    }

    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: payload.jti },
        include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
        if (storedToken) {
        await prisma.refreshToken.deleteMany({ where: { userId: storedToken.userId } });
        }
        throw new AppError(401, 'Refresh-токен недействителен. Пожалуйста, войдите снова.');
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const { token: newRefreshToken, jti: newJti, expiresInMs } = generateRefreshToken(storedToken.userId);
    const expiresAt = new Date(Date.now() + expiresInMs);

    await prisma.refreshToken.create({
        data: {
        token: newJti,
        userId: storedToken.userId,
        expiresAt,
        },
    });

    const newAccessToken = generateAccessToken(storedToken.userId);

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expiresInMs,
        path: '/api/auth',
    });

    res.json({ accessToken: newAccessToken });
});

export const logout = asyncHandler(async (req, res) => {
    const tokenFromCookie = req.cookies?.refreshToken;
    if (tokenFromCookie) {
        try {
            const payload = verifyRefreshToken(tokenFromCookie);
            await prisma.refreshToken.deleteMany({ where: { token: payload.jti } });
        } catch (err) {
            
        }
    }

    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.json({ message: 'Вы вышли из системы' });
});