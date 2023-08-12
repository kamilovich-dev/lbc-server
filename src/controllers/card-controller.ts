import  CardService from 'service/card-service'
import { validationResult } from 'express-validator'
import ApiError from 'exceptions/api-error'
import { Request, Response, NextFunction } from 'express';

class CardController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {moduleId, term, definition, isFavorite } = req.body
            const cardData = await CardService.create(moduleId, term, definition, isFavorite)
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
            const cardData = await CardService.update(cardId, term, definition, isFavorite)
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
            await CardService.remove(cardId)
            return res.json( {} )
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
            const cards = await CardService.getCards( moduleId )
            return res.json(cards)
        } catch(e) {
            next(e);
        }
    }

}

export default new CardController();