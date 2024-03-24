import { module as ModuleModel } from 'models/module'
import { folder as FolderModel } from 'models/folder'
import { bookmark_module as BookmarkModuleModel } from 'models/bookmark_module'
import { card as CardModel } from 'models/card'
import ModuleDto from 'dtos/module-dto'
import ApiError from 'exceptions/api-error'
import bookmarkModuleService from './bookmark-module-service'

export interface IGetModulesQuery {
    by_search: string,
    by_alphabet: 'asc' | 'desc',
    by_updated_date: 'asc' | 'desc'
}

class ModuleService {

    /*Создание модуля*/
    async create(userId:number, name: string, description: string) {
        const module = await ModuleModel.create({name, description, user_id: userId});
        const moduleDto = new ModuleDto(module);
        return { module: moduleDto }
    }

    /*Обновление модуля*/
    async update(userId: number, data: Omit<ModuleDto, 'id'>
        & { moduleId: number }) {

        const { moduleId, name, description, isPublished } = data

        const module = await ModuleModel.findOne({ where: {id: moduleId}});
        if (!module) throw ApiError.BadRequest(`Модуль с id=${moduleId} не найден`);

        if (module.user_id !== userId) throw ApiError.BadRequest(`Только владелец может реадктировать модуль`);

        module.name = name ?? module.name
        module.description = description ?? module.description
        module.is_published = isPublished ?? module.is_published

        await module.save()

        const moduleDto = new ModuleDto(module);
        return { module: moduleDto }
    }

    /*Удаление модуля*/
    async remove(userId: number, id: number) {
        const module = await ModuleModel.findOne({ where: {id}});
        if (!module) throw ApiError.BadRequest(`Модуль с id=${id} не найден`);

        if (module.user_id !== userId) throw ApiError.BadRequest(`Только владелец может удалить модуль`);

        const cards = await CardModel.findAll({where: { module_id: id }, raw: true})
        if (cards.length > 0) throw ApiError.BadRequest(`Модуль имеет созданные карточки`)

        /*Удалить все закладки на модуль*/
        const bookmarks = await BookmarkModuleModel.findAll({ where:{ module_id: id }  })
        const deleteBookmarkPromises = bookmarks.map(item => item.destroy())
        await Promise.all(deleteBookmarkPromises)

        await module.destroy()
    }

    /*Получение личных модулей*/
    async getModules(userId: number, query: IGetModulesQuery) {
        const modules = await ModuleModel.findAll({where: { user_id: userId }})
        const { moduleBookmarks } = await bookmarkModuleService.getBookmarks(userId)

        const userModules = [...modules, ...moduleBookmarks]
        let moduleDtos: ModuleDto[] = []

        for (let module of userModules) {
            const cards = await CardModel.findAll({where: { module_id: module.id }})
            const { createdBy, isOwner } = await module.getUser().then(user => ({
                createdBy: user.dataValues.login,
                isOwner: user.dataValues.id === userId ? true : false
            }))
            moduleDtos.push(new ModuleDto(module, { cardsCount: cards.length, createdBy, isOwner } ))
        }

        moduleDtos = this.filterModules(moduleDtos, query)
        return { modules: moduleDtos }
    }

    /*Получение публичных модулей*/
    async getPublicModules(userId: number, query: IGetModulesQuery) {
        const bookmarks = await bookmarkModuleService.getBookmarks(userId)

        const modules = await ModuleModel.findAll({where: { is_published: true }})
        let moduleDtos: ModuleDto[] = []

        for (let module of modules) {
            const cards = await CardModel.findAll({where: { module_id: module.id }})
            const { createdBy, isOwner } = await module.getUser().then(user => ({
                createdBy: user.dataValues.login,
                isOwner: user.dataValues.id === userId ? true : false
            }))
            const isBookmarked = bookmarks.moduleBookmarks.find(item => item.id === module.id) ? true : false
            moduleDtos.push( new ModuleDto(module, { cardsCount: cards.length, isBookmarked, createdBy, isOwner }) )
        }

        moduleDtos = this.filterModules(moduleDtos, query)
        return { modules: moduleDtos }
    }


    /*Фильтрация модулей*/
    private filterModules(moduleDtos: ModuleDto[], query: IGetModulesQuery ): ModuleDto[] {

        const { by_alphabet: byAlphabet, by_search: bySearch, by_updated_date: byUpdatedDate } = query

        if (bySearch) {
            moduleDtos = moduleDtos.filter( module => {
                const name = module.name?.toLowerCase()
                const description = module.description?.toLowerCase()
                const s = bySearch.toLowerCase()
                return ( name?.includes(s) || description?.includes(s) ) ? true : false
            })
        }

        if (byAlphabet) {
            moduleDtos = moduleDtos.sort( (a, b) => {
                return (byAlphabet === 'asc') ?
                    ( a.name > b.name ? 1 : -1 ) :
                    ( a.name > b.name ? -1 : 1 )
            } )
        }

        if (byUpdatedDate) {
            moduleDtos = moduleDtos.sort( (a, b) => {
                const a_time = a.updatedAt?.getTime()
                const b_time = b.updatedAt?.getTime()

                if (!a_time || !b_time) return -1

                return (byUpdatedDate === 'asc') ?
                    ( a_time > b_time ? 1 : -1 ) :
                    ( a_time > b_time ? -1 : 1 )
            } )
        }

        return moduleDtos
    }



}

export default new ModuleService();
