export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const response = {
        error: err.message || 'Внутренняя ошибка сервера',
    };
    if (err.details) {
        response.details = err.details;
    }
    console.error(err.stack);
    res.status(status).json(response);
};