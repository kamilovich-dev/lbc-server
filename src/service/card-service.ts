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

    async getCards(moduleId: number, search: string, byAlphabet: string) {
        const cards = await CardModel.findAll({where: { module_id: moduleId }, raw: true})
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
