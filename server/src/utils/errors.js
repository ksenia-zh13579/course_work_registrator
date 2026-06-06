export class AppError extends Error {
    constructor(status, message, details = [], code = null) {
        super(message);
        this.status = status;
        this.details = details;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}