import ApiError from 'exceptions/api-error'
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

export default function (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors});
    }
    return res.status(500).json({message: 'Непредвиденная ошибка'});
}