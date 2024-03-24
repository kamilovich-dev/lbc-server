import ApiError from 'exceptions/api-error'
import { user as UserModel } from 'models/user'
import { folder as FolderModel } from 'models/folder'
import FolderDto from 'dtos/folder-dto'
import { bookmark_folder as BookmarkFolderModel } from 'models/bookmark_folder'
import { Op } from 'sequelize'

class BookmarkFolderService {
    /*  1. Проверить, что пользователь с данным userId существует
        2. Проверить, что папка с заданным id существует
        3. Проверяем, что папка не принадлежит пользователю (на свои папки нельзя создавать закладки)
        4. Проверить, что нет закладки с указанной парой userId, folderId - избегаем дублей
    */
    async create(userId: number, folderId: number) {

        const folder = await FolderModel.findOne({ where: {id: folderId}});
        if (!folder) throw ApiError.BadRequest(`Папка с id=${folderId} не существует`);

        if (folder.dataValues.user_id === userId) throw ApiError.BadRequest(`Нельзя создать закладку на свою папку`);
        if (!folder.is_published) throw ApiError.BadRequest(`Нельзя создать закладку на неопубликованную папку`);

        const bookmarkFolder =  await BookmarkFolderModel.findOne({ where: { user_id: userId, folder_id: folderId }});
        if (bookmarkFolder) throw ApiError.BadRequest(`Обнаружены дубли закладки`);

        const createdBookmark = await BookmarkFolderModel.create({ user_id: userId, folder_id: folderId })
        return {  id: createdBookmark.dataValues.id }
    }

    /* 1. Найти закладку с указанным id и удалить*/
    async remove(userId: number, folderId: number) {
        const bookmarkFolders =  await BookmarkFolderModel.findAll({ where: { folder_id: folderId, user_id: userId }});

        let deletedCount = 0
        if (bookmarkFolders) {
            const promises = bookmarkFolders.map(item => item.destroy())
            await Promise.all(promises)
            deletedCount = promises.length
        }

        return { message: `Удалено ${deletedCount} закладок` }
    }

    /*Получить закладки по указанному пользователю*/
    async getBookmarks(userId: number) {
        const bookmarks = await BookmarkFolderModel.findAll({ where: { user_id: userId }, raw: true});

        if (bookmarks && bookmarks.length > 0) {
            const folder_ids = bookmarks.map(item => item.folder_id)
            const result = await FolderModel.findAll({
                where: {
                    id: { [Op.or]: [...folder_ids] },
                    is_published: true
            }})
            return { folderBookmarks: result }
        } else return { folderBookmarks: [] }

    }

}

export default new BookmarkFolderService();
