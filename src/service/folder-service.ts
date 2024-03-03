import { folder as FolderModel } from 'models/folder'
import { module as ModuleModel } from 'models/module'
import { card as CardModel } from 'models/card'
import FolderDto from 'dtos/folder-dto'
import ModuleDto from 'dtos/module-dto'
import ApiError from 'exceptions/api-error'

class FolderService {

    async create(userId:number, name: string) {
        const dublicate = await FolderModel.findOne({ where: { user_id: userId, name: name } })
        if (dublicate) throw ApiError.BadRequest(`Обнаружен дубликат папки`);

        const folder = await FolderModel.create({name, user_id: userId});
        const folderDto = new FolderDto(folder);
        return { folder: folderDto }
    }

    async update(userId: number, data: Omit<FolderDto, 'id'> & { folderId: number }) {

        const { folderId, name, description, isPublished } = data

        const folder = await FolderModel.findOne({ where: {id: folderId}});
        if (!folder)  throw ApiError.BadRequest(`Папка с id=${folderId} не найдена`);

        if (folder.dataValues.user_id !== userId) throw ApiError.BadRequest(`Нельзя редактировать чужую папку`);

        folder.name = name ?? folder.name
        folder.description = description ?? folder.description
        folder.is_published = isPublished ?? folder.is_published

        await folder.save()

        const folderDto = new FolderDto(folder);
        return { folder: folderDto }
    }

    async remove(userId: number, folderId: number) {
        const folder = await FolderModel.findOne({ where: {id: folderId}});
        if (!folder) throw ApiError.BadRequest(`Папка с id=${folderId} не найдена`);

        if (folder.dataValues.user_id !== userId) throw ApiError.BadRequest(`Нельзя удалить чужую папку`);
        const modules = await ModuleModel.findAll({ where: { folder_id: folderId } })
        const promises = modules.map(item => {
            //@ts-ignore
            item.folder_id = null
            return item.save()
        })
        await Promise.all(promises)

        await folder.destroy()
        return { success: true }
    }

    async getFolders(userId: number) {
        const folders = await FolderModel.findAll({where: { user_id: userId }, raw: true})
            .then(async folders => {
                return await Promise.all(folders.map(async folder => {
                    return ModuleModel.findAll({ where: { folder_id: folder.id } })
                        .then(modules => {
                            return { ...folder, modules }
                        })
            }))
        })

        return { folders: folders }
    }

    async getPublicFolders() {
        const folders = await FolderModel.findAll({where: { is_published: true }, raw: true})
            .then(async folders => {
                return await Promise.all(folders.map(async folder => {
                    return ModuleModel.findAll({ where: { folder_id: folder.id, is_published: true } })
                        .then(modules => {
                            return { ...folder, modules }
                        })
            }))
        })

        return { folders: folders }
    }

}

export default new FolderService();
