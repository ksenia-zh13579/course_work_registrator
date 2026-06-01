export const asyncHandler = (func) => (req, res, next) => {
    try {
        Promise.resolve(func(req, res, next)).catch(next);
    } catch (err) {
        next(err);
    }
};