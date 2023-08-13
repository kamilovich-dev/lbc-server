import { Request, Response, NextFunction } from 'express';
import cardService from 'service/card-service'
import { card as CardModel } from 'models/card'
import fileService from 'service/file-service'
import { UploadedFile } from 'express-fileupload'
import { validationResult } from 'express-validator'
import ApiError from 'exceptions/api-error'

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

            const card = await CardModel.findOne( {where: {id: cardId}, raw: true} )
            if (card?.img_url) { //Delete already existing file
                await fileService.removeFile(card.img_url)
            }

            const file = req.files?.img as UploadedFile
            const imgUrl = await fileService.saveFile(file, req.user.email)
            const cardData = await cardService.update(cardId, term, definition, isFavorite, imgUrl)
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
            const card = await CardModel.findOne( {where: {id: cardId}, raw: true} )
            if (card?.img_url) {
                await fileService.removeFile(card.img_url)
            }

            await cardService.remove(cardId)
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
            const { search, by_alphabet } = req.query as unknown as TQuery
            const cards = await cardService.getCards( moduleId, search, by_alphabet )
            return res.json(cards)
        } catch(e) {
            next(e);
        }
    }

}

interface TQuery {
    search: string,
    by_alphabet: string,
}

export default new CardController();