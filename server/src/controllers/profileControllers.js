import { prisma } from '../client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errors.js';
import { verifyPassword, getPasswordHash } from '../utils/passwordActions.js';
import { getUserByUsername } from '../utils/BDgetters.js';

export const getProfile = asyncHandler(async (req, res) => {
    return res.json({data: {
        user_id: req.user.user_id,
        username: req.user.username,
        name: req.user.name,
        surname: req.user.surname,
        patronymic: req.user.patronymic ?? null,
        role: req.user.role,
        updatedAt: req.user.updatedAt,
    }});
});

export const updateProfile = asyncHandler(async (req, res) => {
    const new_data = req.body;
    
    const isOldPassValid = await verifyPassword(new_data.old_password, req.user.password_hash);
    if (!isOldPassValid) {
        throw new AppError(401, "Неверный прежний пароль!");
    }

    if (new_data.username !== undefined && new_data.username !== req.user.username) {
        const otherExistingUser = await getUserByUsername(new_data.username);
        if (otherExistingUser)
            throw new AppError(409, "Такое имя пользователя уже занято!");
    }

    const newPassHash = new_data.new_password !== undefined
    ? await getPasswordHash(new_data.new_password, 10)
    : undefined;

    const updatedUser = await prisma.user.update({
        where: {user_id: req.user.user_id},
        data: {
            username: new_data.username || req.user.username,
            surname: new_data.surname || req.user.surname,
            name: new_data.name || req.user.name,
            patronymic: new_data.patronymic || req.user.patronymic || null,
            password_hash: newPassHash || req.user.password_hash,
        }
    });

    req.user = updatedUser;
    res.json({ data: {
        user_id: updatedUser.user_id,
        username: updatedUser.username,
        name: updatedUser.name,
        surname: updatedUser.surname,
        patronymic: updatedUser.patronymic,
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt
    } });
});