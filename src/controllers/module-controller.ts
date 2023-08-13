import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator'
import ApiError from 'exceptions/api-error'
import  ModuleService from 'service/module-service'


class ModuleController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {userId, name, description } = req.body
            const moduleData =  await ModuleService.create(userId, name, description)
            return res.json(moduleData)
        } catch(e) {
            next(e);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { moduleId, name, description } = req.body
            const moduleData = await ModuleService.update(moduleId, name, description)
            return res.json(moduleData)
        } catch(e) {
            next(e);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { moduleId } = req.body
            await ModuleService.remove(moduleId)
            return res.json( {} )
        } catch(e) {
            next(e);
        }
    }

    async getModules(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { userId } = req.body
            const { search, by_alphabet } = req.query as unknown as TQuery
            const modules = await ModuleService.getModules( userId, search, by_alphabet )
            return res.json(modules)
        } catch(e) {
            next(e);
        }
    }

}

interface TQuery {
    search: string,
    by_alphabet: string,
}

export default new ModuleController();