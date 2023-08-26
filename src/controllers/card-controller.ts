import { Request, Response, NextFunction } from 'express';
import cardService from 'service/card-service'
import { card as CardModel } from 'models/card'

import { validationResult } from 'express-validator'
import ApiError from 'exceptions/api-error'
import { UploadedFile } from 'express-fileupload'

class CardController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {moduleId, term, definition, isFavorite } = req.body
            const cardData = await cardService.create(moduleId, term, definition, isFavorite)
            return res.json(cardData)
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
            const { cardId, term, definition, isFavorite } = req.body

            const file = req.files?.img as UploadedFile
            const cardData = await cardService.update(cardId, term, definition, isFavorite, file, req.user.email)
            return res.json(cardData)
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
            const { cardId } = req.body

            await cardService.remove(cardId)
            return res.json( {} )
        } catch(e) {
            next(e);
        }
    }

    async switchOrder(req: Request, res: Response, next: NextFunction){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { cardId1, cardId2 } = req.body
            const cards = await cardService.switchOrder( cardId1, cardId2 )
            return res.json({})
        } catch(e) {
            next(e);
        }
    }

    async getCards(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { moduleId } = req.body
            const { by_search, by_alphabet } = req.query as unknown as TQuery
            const cards = await cardService.getCards( moduleId, by_search, by_alphabet )
            return res.json(cards)
        } catch(e) {
            next(e);
        }
    }

}

interface TQuery {
    by_search: string,
    by_alphabet: string,
}

export default new CardController();