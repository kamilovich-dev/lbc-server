import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator'
import ApiError from 'exceptions/api-error'
import  ModuleService from 'service/module-service'
import type { IGetModulesQuery } from 'service/module-service';

class ModuleController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            const { id: userId } = req.user
            const {name, description } = req.body
            const moduleData =  await ModuleService.create(userId, name, description)
            return res.json(moduleData)
        } catch(e) {
            next(e);
        }
    }

    async getModules(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            const { id: userId } = req.user
            const modules = await ModuleService.getModules( userId, req.query as unknown as IGetModulesQuery )

            // const pause = await new Promise((resolve) => setTimeout(resolve, 500))
            return res.json(modules)
        } catch(e) {
            next(e);
        }
    }

    async getPublicModules(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            const {id: userId } = req.user
            const modules = await ModuleService.getPublicModules(userId, req.query as unknown as IGetModulesQuery )

            // const pause = await new Promise((resolve) => setTimeout(resolve, 500))
            return res.json(modules)
        } catch(e) {
            next(e);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const moduleData = await ModuleService.update(userId, req.body)
            return res.json(moduleData)
        } catch(e) {
            next(e);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const { moduleId } = req.body
            await ModuleService.remove(userId, moduleId)
            return res.json( {} )
        } catch(e) {
            next(e);
        }
    }

}

export default new ModuleController();