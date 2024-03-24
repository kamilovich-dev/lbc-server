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
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const cardData = await cardService.create(userId, req.body)
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
            const { id: userId, email } = req.user

            const file = req.files?.imgFile as UploadedFile
            const cardData = await cardService.update(userId, email, file, req.body)
            return res.json(cardData)
        } catch(e) {
            next(e);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const { cardId } = req.body

            await cardService.remove(userId, cardId)
            return res.json( {} )
        } catch(e) {
            next(e);
        }
    }

    async switchOrder(req: Request, res: Response, next: NextFunction){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const { cardId1, cardId2 } = req.body
            await cardService.switchOrder( userId, cardId1, cardId2 )
            return res.json({})
        } catch(e) {
            next(e);
        }
    }

    async getCards(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));

            const { id: userId } = req.user
            const { moduleId } = req.body
            const cards = await cardService.getCards( userId, moduleId )
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