import CardDto from 'dtos/card-dto'
import ApiError from 'exceptions/api-error'
import { user as UserModel } from 'models/user'
import { module as ModuleModel } from 'models/module'
import ModuleDto from 'dtos/module-dto'
import { bookmark_module as BookmarkModuleModel } from 'models/bookmark_module'
import { Op } from 'sequelize'

class BookmarkModuleService {

    /*  1. Проверить, что пользователь с данным userId существует
        2. Проверить, что модуль с заданным id существует
        3. Проверяем, что модуль нам не принадлежит
        4. Проверить, что не закладки с указанной парой userId, moduleId - избегаем дублей
    */
    async create(userId: number, moduleId: number) {

        const module = await ModuleModel.findOne({ where: {id: moduleId}});
        if (!module) throw ApiError.BadRequest(`Модуль с id=${moduleId} не существует`);

        if (module.dataValues.user_id === userId) throw ApiError.BadRequest(`Нельзя создать закладку на собственный модуль`);
        if (!module.is_published) throw ApiError.BadRequest(`Нельзя создать закладку на неопубликованный модуль`);

        const bookmarkModule =  await BookmarkModuleModel.findOne({ where: { user_id: userId, module_id: moduleId }});
        if (bookmarkModule) throw ApiError.BadRequest(`Обнаружены дубли закладки`);

        const createdBookmark = await BookmarkModuleModel.create({ user_id: userId, module_id: moduleId })
        return {  id: createdBookmark.dataValues.id }

    }

    /* 1. Найти закладку с указанным id и удалить*/
    async remove(userId: number, moduleId: number) {
        const bookmarkModules =  await BookmarkModuleModel.findAll({ where: { module_id: moduleId, user_id: userId }});

        let deletedCount = 0
        if (bookmarkModules) {
            const promises = bookmarkModules.map(item => item.destroy())
            await Promise.all(promises)
            deletedCount = promises.length
        }

        return { message: `Удалено ${deletedCount} закладок` }
    }

    /*Получить закладки по указанному пользователю*/
    async getBookmarks(userId: number) {
        const bookmarks = await BookmarkModuleModel.findAll({ where: { user_id: userId }, raw: true});

        if (bookmarks && bookmarks.length > 0) {
            const module_ids = bookmarks.map(item => item.module_id)
            const result = await ModuleModel.findAll({
                where: {
                    id: module_ids,
                    is_published: true
            }})
            return { moduleBookmarks: result }
        } else return { moduleBookmarks: [] }
    }

}

export default new BookmarkModuleService();
