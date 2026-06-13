import { Prisma } from '@prisma/client';

export const errorHandler = (err, req, res, next) => {
    let status = err.status || 500;
    let response = {
        error: err.message || 'Внутренняя ошибка сервера',
    };
    if (err.details) {
        response.details = err.details;
        console.error(err.details);
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
        case 'P2002':
            status = 409;
            response.error = 'Запись с такими уникальными данными уже существует';
        case 'P2025':
            status = 404;
            response.error = 'Запись не найдена';
        case 'P2003':
            status = 400;
            response.error = 'Некорректная ссылка на связанную запись';
        case 'P2014':
            status = 409;
            response.error = 'Невозможно удалить запись из-за связанных данных';
        default:
            status = 400;
            response.error = 'Ошибка базы данных';
        }
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        status = 400;
        response.error = 'Некорректные данные для запроса';
    }

    console.error(err.stack);
    res.status(status).json(response);
};