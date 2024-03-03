import ApiError from 'exceptions/api-error'
import { user as UserModel } from 'models/user'
import { folder as FolderModel } from 'models/folder'
import FolderDto from 'dtos/folder-dto'
import { bookmark_folder as BookmarkFolderModel } from 'models/bookmark_folder'

class BookmarkFolderService {
    /*  1. Проверить, что пользователь с данным userId существует
        2. Проверить, что папка с заданным id существует
        3. Проверяем, что папка не принадлежит пользователю (на свои папки нельзя создавать закладки)
        4. Проверить, что нет закладки с указанной парой userId, folderId - избегаем дублей
    */
    async create(userId: number, folderId: number) {

        const user = await UserModel.findOne({ where: { id: userId} });
        if (!user) throw ApiError.BadRequest(`Пользователь с id=${userId} не существует`);

        const folder = await FolderModel.findOne({ where: {id: folderId}});
        if (!folder) throw ApiError.BadRequest(`Папка с id=${folderId} не существует`);

        if (folder.dataValues.user_id === userId) throw ApiError.BadRequest(`Нельзя создать закладку на свою папку`);
        if (!folder.is_published) throw ApiError.BadRequest(`Нельзя создать закладку на неопубликованную папку`);

        const bookmarkFolder =  await BookmarkFolderModel.findOne({ where: { user_id: userId, folder_id: folderId }});
        if (bookmarkFolder) throw ApiError.BadRequest(`Обнаружены дубли закладки`);

        const createdBookmark = await BookmarkFolderModel.create({ user_id: userId, folder_id: folderId })
        return {
            moduleBookmark: createdBookmark
        }

    }

    /* 1. Найти закладку с указанным id и удалить*/
    async remove(userId: number, bookmarkId: number) {
        const bookmarkFolder =  await BookmarkFolderModel.findOne({ where: { id: bookmarkId }});
        if (!bookmarkFolder) throw ApiError.BadRequest(`Закладка с bookmarkId=${bookmarkId} не найдена`);

        if (userId !== bookmarkFolder.dataValues.user_id) throw ApiError.BadRequest(`Нельзя удалить чужую закладку`);

        await bookmarkFolder.destroy()
        return { succes: true }
    }

    /*Получить закладки по указанному пользователю*/
    async getBookmarks(userId: number) {
        const bookmarks = await BookmarkFolderModel.findAll({where: { user_id: userId }, raw: true})

        if (bookmarks && bookmarks.length > 0) {
            const folder_ids = bookmarks.map(item => item.folder_id)
            let promises: Promise<any>[] = []
            let result: FolderDto[] = []
            for (const id of folder_ids) {
                promises.push(FolderModel.findOne({where: { id, is_published: true }}))
            }
            await Promise.all(promises)
                .then(items => {
                    result = items.map(item => new FolderDto(item))
                })
            return { folder_bookmarks: result }
        } else return { folder_bookmarks: [] }
    }

}

export default new BookmarkFolderService();
