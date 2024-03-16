import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express';
import ApiError from 'exceptions/api-error'
import personalService from 'service/personal-service';
import { UploadedFile } from 'express-fileupload'

class PersonalController {

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const personalData = await personalService.create(userId);
            return res.json(personalData);
        } catch(e) {
            next(e)
        }
    }

    async getPersonalData(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const personalData = await personalService.getPersonalData(userId);
            return res.json(personalData);
        } catch(e) {
            next(e);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const personalData = await personalService.update(userId, req.body);
            return res.json(personalData);
        } catch(e) {
            next(e)
        }
    }
}

export default new PersonalController();