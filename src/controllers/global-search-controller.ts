import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator'
import ApiError from 'exceptions/api-error'
import globalSearchService from 'service/global-search-service';
import type { IGlobalSearchQuery } from 'service/global-search-service';

class GlobalSearchController {

    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const result = await globalSearchService.search( userId, req.query as unknown as IGlobalSearchQuery )
            return res.json(result)
        } catch(e) {
            next(e);
        }
    }

}

export default new GlobalSearchController();