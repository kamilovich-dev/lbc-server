import { module as ModuleModel } from 'models/module'
import ModuleDto from 'dtos/module-dto'
import ApiError from 'exceptions/api-error'

class ModuleService {

    async create(userId:number, name: string, description: string) {
        const module = await ModuleModel.create({name, description, user_id: userId});
        const moduleDto = new ModuleDto(module);
        return { module: moduleDto }
    }

    async update(id: number, name: string, description: string) {
        const module = await ModuleModel.findOne({ where: {id}});
        if (!module) {
            throw ApiError.BadRequest(`Модуль с id=${id} не найден`);
        }
        module.name = name
        module.description = description
        await module.save()

        const moduleDto = new ModuleDto(module);
        return { module: moduleDto }
    }

    async remove(id: number) {
        const module = await ModuleModel.findOne({ where: {id}});
        if (!module) {
            throw ApiError.BadRequest(`Модуль с id=${id} не найден`);
        }
        await module.destroy()
    }

    async getModules(userId: number) {
        const modules = await ModuleModel.findAll({where: { user_id: userId }, raw: true})
        const moduleDtos: ModuleDto[] = []
        for (let module of modules) {
            moduleDtos.push(new ModuleDto(module))
        }
        return { modules: moduleDtos }
    }

}

export default new ModuleService();
