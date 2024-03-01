import { module as ModuleModel } from 'models/module'
import { card as CardModel } from 'models/card'
import ModuleDto from 'dtos/module-dto'
import ApiError from 'exceptions/api-error'

class ModuleService {

    async create(userId:number, name: string, description: string) {
        const module = await ModuleModel.create({name, description, user_id: userId});
        const moduleDto = new ModuleDto(module);
        return { module: moduleDto }
    }

    async update(data: Omit<ModuleDto, 'id'>
        & { moduleId: number, isPublished: boolean | undefined }) {

        const { moduleId, name, description, isFavorite, isPublished } = data

        const module = await ModuleModel.findOne({ where: {id: moduleId}});
        if (!module) {
            throw ApiError.BadRequest(`Модуль с id=${moduleId} не найден`);
        }

        module.name = name ?? module.name
        module.description = description ?? module.description
        module.is_favorite = isFavorite ?? module.is_favorite
        module.is_published = isPublished ?? module.is_published

        await module.save()

        const moduleDto = new ModuleDto(module);
        return { module: moduleDto }
    }

    async remove(id: number) {
        const module = await ModuleModel.findOne({ where: {id}});
        if (!module) {
            throw ApiError.BadRequest(`Модуль с id=${id} не найден`);
        }

        const cards = await CardModel.findAll({where: { module_id: id }, raw: true})
        if (cards.length > 0) {
            throw ApiError.BadRequest(`Модуль имеет созданные карточки`)
        }

        await module.destroy()
    }

    async getModules(userId: number, bySearch: string, byAlphabet: string, byFavorite: string) {
        const modules = await ModuleModel.findAll({where: { user_id: userId }, raw: true})
        let moduleDtos: ModuleDto[] = []
        for (let module of modules) {
            const cards = await CardModel.findAll({where: { module_id: module.id }, raw: true})
            moduleDtos.push(new ModuleDto(module, cards.length))
        }

        if (bySearch) {
            moduleDtos = moduleDtos.filter( module => {
                const mN = module.name.toLowerCase()
                const mD = module.description?.toLowerCase()
                const s = bySearch.toLowerCase()
                if (mN.includes(s) || mD?.includes(s)) return true
            })
        }

        if (byAlphabet) {
            moduleDtos = moduleDtos.sort( (a, b) => {
                return (byAlphabet === 'asc') ?
                    ( a.name > b.name ? 1 : -1 ) :
                    ( a.name > b.name ? -1 : 1 )
            } )
        }

        if (byFavorite) {
            moduleDtos = moduleDtos.filter(item => item.isFavorite === true)
        }

        return { modules: moduleDtos }
    }

}

export default new ModuleService();
