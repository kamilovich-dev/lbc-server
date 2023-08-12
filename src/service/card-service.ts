import { card as CardModel } from 'models/card'
import CardDto from 'dtos/card-dto'
import ApiError from 'exceptions/api-error'

class CardService {

    async create(moduleId: number, term: string, definition: string, isFavorite: boolean) {
        const card = await CardModel.create({module_id: moduleId, term, definition, is_favorite: isFavorite});
        const cardDto = new CardDto(card);
        return { card: cardDto }
    }

    async update(cardId: number, term: string, definition: string, isFavorite: boolean) {
        const card = await CardModel.findOne({ where: {id: cardId}});
        if (!card) {
            throw ApiError.BadRequest(`Карточка с id=${cardId} не найдена`);
        }
        card.term = term
        card.definition = definition
        card.is_favorite = isFavorite
        await card.save()

        const cardDto = new CardDto(card);
        return { card: cardDto }
    }

    async remove(cardId: number) {
        const card = await CardModel.findOne({ where: {id: cardId}});
        if (!card) {
            throw ApiError.BadRequest(`Карточка с id=${cardId} не найден`);
        }
        await card.destroy()
    }

    async getCards(moduleId: number) {
        const cards = await CardModel.findAll({where: { module_id: moduleId }, raw: true})
        const cardDtos: CardDto[] = []
        for (let card of cards) {
            cardDtos.push(new CardDto(card))
        }
        return { cards: cardDtos }
    }

}

export default new CardService();
