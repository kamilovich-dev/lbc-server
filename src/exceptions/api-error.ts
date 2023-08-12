import { ValidationError } from "express-validator";

export default class ApiError extends Error {
    status;
    errors;

    constructor(status: number, message: string, errors: Error[]  | ValidationError[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован');
    }

    static BadRequest(message:string, errors:ValidationError[] = []) {
        return new ApiError(400, message, errors);
    }

    static DbError(message:string, error: Error) {
        return new ApiError(500, message, [ error ]);
    }

    static MailError(message:string, error: Error) {
        return new ApiError(500, message, [ error ]);
    }
}