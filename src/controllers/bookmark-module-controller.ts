import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator'
import ApiError from 'exceptions/api-error'
import bookmarkModuleService from 'service/bookmark-module-service'

class BookmarkModuleController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { id: userId } = req.user
            const { moduleId } = req.body

            const data = await bookmarkModuleService.create(userId, moduleId)
            return res.json(data)
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

            const data = await bookmarkModuleService.remove(userId, moduleId)
            return res.json(data)
        } catch(e) {
            next(e);
        }
    }

    async getBookmarks(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const data = await bookmarkModuleService.getBookmarks(userId)
            return res.json(data)

        } catch(e) {
            next(e);
        }
    }

}

export default new BookmarkModuleController();