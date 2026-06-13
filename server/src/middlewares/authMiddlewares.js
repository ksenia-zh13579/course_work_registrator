import { prisma } from "../client.js";
import { verifyAccessToken, verifyRefreshToken, generateRefreshToken } from "../utils/jwtTokens.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(403, 'Требуется авторизация');
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
        payload = verifyAccessToken(token);
    } catch (err) {
        throw new AppError(403, 'Токен недействителен или истёк');
    }

    const user = await prisma.user.findUnique({
        where: { user_id: payload.userId },
    });

    if (!user) {
        throw new AppError(403, 'Пользователь не найден');
    }

    req.user = user;
    next();
});


export const authenticateForLogout = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new AppError(403, 'Refresh-токен отсутствует');
    }

    let payload;
    try {
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            payload = verifyAccessToken(token);
        } else {
            throw new Error('No access token');
        }
    } catch (err) {
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch (refreshErr) {
            throw new AppError(403, 'Токены недействительны или истекли');
        }
    }

    const user = await prisma.user.findUnique({
        where: { user_id: payload.userId },
    });

    if (!user) {
        throw new AppError(403, 'Пользователь не найден');
    }

    req.user = user;
    next();
});

/**
 * @param {string} permissionName
 */
export const authorize = (permissionName) => {
    return asyncHandler(async (req, res, next) => {
        const permission = await prisma.permission.findUnique({
            where: { name: permissionName },
        });
        if (!permission) {
            throw new AppError(401, 'Доступ запрещён: неизвестное разрешение');
        }

        const userId = req.user.user_id;
        const permissionId = permission.permission_id;

        const userPermission = await prisma.userPermission.findFirst({
            where: { user_id: userId, permission_id: permissionId },
        });
        if (userPermission) return next();

        const rolePermission = await prisma.rolePermission.findFirst({
            where: {
                role: req.user.role,
                permission_id: permissionId,
            },
        });
        if (rolePermission) return next();

        throw new AppError(401, 'Доступ запрещён');
    });
};