import { prisma } from "../client";
import { verifyAccessToken, generateRefreshToken } from "../utils/jwtTokens";
import { AppError } from "../utils/errors";
import { asyncHandler } from "../utils/asyncHandler";

export const authenticate = asyncHandler((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(403, 'Требуется авторизация');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

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
    return asyncHandler((req, res, next) => {
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