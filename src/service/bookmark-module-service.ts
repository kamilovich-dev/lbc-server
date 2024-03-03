import CardDto from 'dtos/card-dto'
import ApiError from 'exceptions/api-error'
import { user as UserModel } from 'models/user'
import { module as ModuleModel } from 'models/module'
import ModuleDto from 'dtos/module-dto'
import { bookmark_module as BookmarkModuleModel } from 'models/bookmark_module'

class BookmarkModuleService {

    /*  1. Проверить, что пользователь с данным userId существует
        2. Проверить, что модуль с заданным id существует
        3. Проверяем, что модуль нам не принадлежит
        4. Проверить, что не закладки с указанной парой userId, moduleId - избегаем дублей
    */
    async create(userId: number, moduleId: number) {

        const user = await UserModel.findOne({ where: { id: userId} });
        if (!user) throw ApiError.BadRequest(`Пользователь с id=${userId} не существует`);

        const module = await ModuleModel.findOne({ where: {id: moduleId}});
        if (!module) throw ApiError.BadRequest(`Модуль с id=${moduleId} не существует`);

        if (module.dataValues.user_id === userId) throw ApiError.BadRequest(`Нельзя создать закладку на собственный модуль`);
        if (!module.is_published) throw ApiError.BadRequest(`Нельзя создать закладку на неопубликованный модуль`);

        const bookmarkModule =  await BookmarkModuleModel.findOne({ where: { user_id: userId, module_id: moduleId }});
        if (bookmarkModule) throw ApiError.BadRequest(`Обнаружены дубли закладки`);

        const createdBookmark = await BookmarkModuleModel.create({ user_id: userId, module_id: moduleId })
        return {
            moduleBookmark: createdBookmark
        }

    }

    /* 1. Найти закладку с указанным id и удалить*/
    async remove(userId: number, bookmarkId: number) {
        const bookmarkModule =  await BookmarkModuleModel.findOne({ where: { id: bookmarkId }});
        if (!bookmarkModule) throw ApiError.BadRequest(`Закладка с bookmarkId=${bookmarkId} не найдена`);

        if (userId !== bookmarkModule.dataValues.id) throw ApiError.BadRequest(`Нельзя удалить чужую закладку`);

        await bookmarkModule.destroy()
        return { succes: true }
    }

    /*Получить закладки по указанному пользователю*/
    async getBookmarks(userId: number) {
        const bookmarks = await BookmarkModuleModel.findAll({ where: { user_id: userId }, raw: true});

        if (bookmarks && bookmarks.length > 0) {
            const module_ids = bookmarks.map(item => item.module_id)
            let promises: Promise<any>[] = []
            let result: ModuleDto[] = []
            for (const id of module_ids) {
                promises.push(ModuleModel.findOne({where: { id, is_published: true }}))
            }
            await Promise.all(promises)
                .then(items => {
                    result = items.map(item => new ModuleDto(item))
                })
            return { module_bookmarks: result }
        } else return { module_bookmarks: [] }
    }

}

export default new BookmarkModuleService();
