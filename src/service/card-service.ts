import { card as CardModel } from 'models/card'
import CardDto from 'dtos/card-dto'
import ApiError from 'exceptions/api-error'
import fileService from 'service/file-service'
import { UploadedFile } from 'express-fileupload'

class CardService {

    async create(moduleId: number, term: string, definition: string, isFavorite: boolean) {
        const order = await CardModel.max('order', {where: { module_id: moduleId }, raw: true}) as number
        const card = await CardModel.create({module_id: moduleId, term, definition, is_favorite: isFavorite, order: order + 1});
        const cardDto = new CardDto(card);
        return { card: cardDto }
    }

    async update(cardId: number, term: string, definition: string, isFavorite: boolean, imgFile:UploadedFile, email: string) {
        const card = await CardModel.findOne({ where: {id: cardId}});
        if (!card) {
            throw ApiError.BadRequest(`Карточка с id=${cardId} не найдена`);
        }

        if (card.dataValues.img_url) { //Delete already existing file
            await fileService.removeFile(card.dataValues.img_url)
        }

        const imgUrl = await fileService.saveFile(imgFile, email)
        card.term = term
        card.definition = definition
        card.is_favorite = isFavorite
        card.img_url = imgUrl
        await card.save()

        const cardDto = new CardDto(card);
        return { cardDto }
    }

    async remove(cardId: number) {
        const card = await CardModel.findOne({ where: {id: cardId}});
        if (!card) {
            throw ApiError.BadRequest(`Карточка с id=${cardId} не найден`);
        }

        if (card.dataValues.img_url) {
            await fileService.removeFile(card.dataValues.img_url)
        }

        await card.destroy()
    }

    async switchOrder(cardId1: number, cardId2: number) {
        const card1 = await CardModel.findOne({ where: {id: cardId1}});
        if (!card1) {
            throw ApiError.BadRequest(`Карточка с id=${cardId1} не найден`);
        }
        const card2 = await CardModel.findOne({ where: {id: cardId2}});
        if (!card2) {
            throw ApiError.BadRequest(`Карточка с id=${cardId2} не найден`);
        }
        if (card1.module_id !== card2.module_id) {
            throw ApiError.BadRequest(`Карточки относятся к разным модулям`);
        }
        [card1.order, card2.order] = [card2.order, card1.order]
        await card1.save()
        await card2.save()
    }

    async getCards(moduleId: number, search: string, byAlphabet: string) {
        const cards = await CardModel.findAll({where: { module_id: moduleId }, order: [
            ['order', 'ASC']
        ], raw: true})
        let cardDtos: CardDto[] = []
        for (let card of cards) {
            cardDtos.push(new CardDto(card))
        }

        if (search) {
            cardDtos = cardDtos.filter( card => {
                const cN = card.term.toLowerCase()
                const cD = card.definition?.toLowerCase()
                const s = search.toLowerCase()
                if (cN.includes(s) || cD?.includes(s)) return true
            })
        }

        if (byAlphabet) {
            cardDtos = cardDtos.sort( (a, b) => {
                return (byAlphabet === 'asc') ?
                    ( a.term > b.term ? 1 : -1 ) :
                    ( a.term > b.term ? -1 : 1 )
            } )
        }

        return { cards: cardDtos }
    }

}

export default new CardService();
