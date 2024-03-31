import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator'
import ApiError from 'exceptions/api-error'
import folderService from 'service/folder-service';
import type { IGetFoldersQuery } from 'service/folder-service';


class FolderController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id } = req.user
            const { name, description } = req.body
            const folderData =  await folderService.create(id, name, description)
            return res.json(folderData)
        } catch(e) {
            next(e);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

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
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const { folderId } = req.body
            const folderData = await folderService.remove(userId, folderId)
            return res.json(folderData)
        } catch(e) {
            next(e);
        }
    }

    async getModules(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const { folderId } = req.body
            const modules = await folderService.getModules( folderId, userId)
            return res.json(modules)
        } catch(e) {
            next(e);
        }
    }

    async getFolders(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const folders = await folderService.getFolders( userId, req.query as unknown as IGetFoldersQuery )
            return res.json(folders)
        } catch(e) {
            next(e);
        }
    }

    async getPublicFolders(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const folders = await folderService.getPublicFolders( userId,  req.query as unknown as IGetFoldersQuery)
            return res.json(folders)
        } catch(e) {
            next(e);
        }
    }

    async addModule(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            const {id: userId } = req.user
            const {moduleId, folderId } = req.body
            const data = await folderService.addModule(userId, moduleId, folderId)
            return res.json(data)
        } catch(e) {
            next(e)
        }
    }

    async removeModule(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            const {id: userId } = req.user
            const {moduleId, folderId } = req.body
            const data = await folderService.removeModule(userId, moduleId, folderId)
            return res.json(data)
        } catch(e) {
            next(e)
        }
    }

}

export default new FolderController();