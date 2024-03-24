import { card as CardModel } from 'models/card'
import { module as ModuleModel } from 'models/module'
import * as path from 'path';
import CardDto from 'dtos/card-dto'
import ApiError from 'exceptions/api-error'
import fileService from 'service/file-service'
import { UploadedFile } from 'express-fileupload'
import UserDto from 'dtos/user-dto';

class CardService {

    async create(userId: number, data: Omit<CardDto, 'id' | 'order' | 'imgUrl'> & { moduleId: number }) {
        const { moduleId, term, definition, isFavorite } = data

        const module = await ModuleModel.findOne({ where: {  id: moduleId } })
        if (!module) throw ApiError.BadRequest(`Модуль не найден`);
        if (module.user_id !== userId) throw ApiError.BadRequest(`Только владелец может создавать карточки модуля`);

        const order = await CardModel.max('order', {where: { module_id: moduleId }}) as number | undefined
        const card = await CardModel.create({module_id: moduleId, term, definition, is_favorite: isFavorite ?? false, order:  order ? order + 1 : 1});
        const cardDto = new CardDto(card);
        return { card: cardDto }
    }

    async update( userId: number, email: string, imgFile:UploadedFile, data:
        Omit<CardDto, 'id'> &  { cardId: number, isFavorite: string | undefined }) {


        const { cardId, term, definition, isFavorite, imgUrl } = data
        const card = await CardModel.findOne({ where: {id: cardId}});
        if (!card) throw ApiError.BadRequest(`Карточка с id=${cardId} не найдена`);

        const module = await ModuleModel.findOne({ where: { id: card.module_id } })
        if (!module) throw ApiError.BadRequest(`Карточка не привязана к модулю`);

        if (module.dataValues.user_id !== userId)  throw ApiError.BadRequest(`Только владелец может редактировать карточки модуля`);

        card.term = term ?? card.term
        card.definition = definition ?? card.definition
        card.is_favorite = isFavorite === 'true' ? true :
            isFavorite === 'false' ? false : card.is_favorite

        if (imgUrl === 'null') {
            if (card.dataValues.img_url) await fileService.removeFile(card.dataValues.img_url)
            //@ts-ignore
            card.img_url = null
        } else if (imgFile && email) {
            if (card.dataValues.img_url) await fileService.removeFile(card.dataValues.img_url)
            const imgUrl = await fileService.saveFile(imgFile, email)
            card.img_url = imgUrl
        }

        await card.save()
        const cardDto = new CardDto(card);
        return { card: cardDto }
    }

    async remove(userId: number, cardId: number) {
        const card = await CardModel.findOne({ where: {id: cardId}});
        if (!card) throw ApiError.BadRequest(`Карточка с id=${cardId} не найден`);

        const module = await ModuleModel.findOne({ where: { id: card.module_id } })
        if (!module) throw ApiError.BadRequest(`Карточка не привязана к модулю`);

        if (module.dataValues.user_id !== userId) throw ApiError.BadRequest(`Только владелец может удалять карточки модуля`);

        if (card.dataValues.img_url) await fileService.removeFile(card.dataValues.img_url)

        await card.destroy()
    }

    async switchOrder(userId: number, cardId1: number, cardId2: number) {
        const card1 = await CardModel.findOne({ where: {id: cardId1}});
        if (!card1) throw ApiError.BadRequest(`Карточка с id=${cardId1} не найден`);

        const card2 = await CardModel.findOne({ where: {id: cardId2}});
        if (!card2) throw ApiError.BadRequest(`Карточка с id=${cardId2} не найден`);

        if (card1.module_id !== card2.module_id) throw ApiError.BadRequest(`Карточки относятся к разным модулям`);

        const module = await ModuleModel.findOne({ where: { id: card1.module_id } });
        if (!module) throw ApiError.BadRequest(`Карточки не привязаны к модулю`);

        if (module.dataValues.user_id !== userId) throw ApiError.BadRequest(`Только владелец может менять порядок карточек модуля`);

        [card1.order, card2.order] = [card2.order, card1.order]
        await card1.save()
        await card2.save()
    }

    async getCards(userId: number, moduleId: number) {
        const module = await ModuleModel.findOne({ where: { id: moduleId } })
        if (!module) throw ApiError.BadRequest(`Модуль не существует`);

        const { user_id, is_published } = module.dataValues
        if (user_id !== userId && is_published !== true) throw ApiError.BadRequest(`Разрешен доступ только к карточкам личных или публичных модулей`);

        const cards = await CardModel.findAll({where: { module_id: moduleId }, order: [
            ['order', 'ASC']
        ], raw: true})

        const cardDtos: CardDto[] = []
        for (let card of cards) {
            cardDtos.push(new CardDto({
                ...card
            }))
        }

        return { cards: cardDtos }
    }

}

export default new CardService();
