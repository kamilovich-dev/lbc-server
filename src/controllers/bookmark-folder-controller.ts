import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator'
import ApiError from 'exceptions/api-error'
import bookmarkFolderService from 'service/bookmark-folder-service'

class BookmarkFolderController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { id: userId } = req.user
            const { folderId } = req.body

            const data = await bookmarkFolderService.create(userId, folderId)
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
            const { folderId } = req.body

            const data = await bookmarkFolderService.remove(userId, folderId)
            return res.json(data)
        } catch(e) {
            next(e);
        }
    }

}

export default new BookmarkFolderController();