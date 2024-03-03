import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator'
import ApiError from 'exceptions/api-error'
import folderService from 'service/folder-service';


class FolderController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { id } = req.user
            const { name } = req.body
            const folderData =  await folderService.create(id, name)
            return res.json(folderData)
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
            const { id: userId } = req.user
            const folderData = await folderService.update(userId, req.body)
            return res.json(folderData)
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
            const { id: userId } = req.user
            const { folderId } = req.body
            const folderData = await folderService.remove(userId, folderId)
            return res.json(folderData)
        } catch(e) {
            next(e);
        }
    }

    async getFolders(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user
            const folders = await folderService.getFolders( userId )
            return res.json(folders)
        } catch(e) {
            next(e);
        }
    }

    async getPublicFolders(req: Request, res: Response, next: NextFunction) {
        try {
            const folders = await folderService.getPublicFolders()
            return res.json(folders)
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

export default new FolderController();