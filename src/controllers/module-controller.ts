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
            const {id } = req.user
            const {name, description } = req.body
            const moduleData =  await ModuleService.create(id, name, description)
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

            const moduleData = await ModuleService.update(req.body)
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
            const userId = req.user.id
            if (!userId) {
                return next(ApiError.UnauthorizedError());
            }
            const { by_search, by_alphabet, by_favorite } = req.query as unknown as TQuery
            const modules = await ModuleService.getModules( userId, by_search, by_alphabet, by_favorite )

            // const pause = await new Promise((resolve) => setTimeout(resolve, 500))
            return res.json(modules)
        } catch(e) {
            next(e);
        }
    }

}

interface TQuery {
    by_search: string,
    by_alphabet: string,
    by_favorite: string
}

export default new ModuleController();