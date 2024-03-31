import { folder as FolderModel } from 'models/folder'
import { module as ModuleModel } from 'models/module'
import FolderDto from 'dtos/folder-dto'
import ApiError from 'exceptions/api-error'
import { card as CardModel } from 'models/card'
import bookmarkFolderService from './bookmark-folder-service'
import { bookmark_folder as BookmarFolderModel } from 'models/bookmark_folder'
import ModuleDto from 'dtos/module-dto'

export interface IGetFoldersQuery {
    by_search?: string,
    by_alphabet?: 'asc' | 'desc',
    by_updated_date?: 'asc' | 'desc',
}

class FolderService {

    async create(userId:number, name: string, description: string) {
        const dublicate = await FolderModel.findOne({ where: { user_id: userId, name: name } })
        if (dublicate) throw ApiError.BadRequest(`Обнаружен дубликат папки`);

        const folder = await FolderModel.create({name, description, user_id: userId});
        const user = await folder.getUser()
        const folderDto = new FolderDto(folder, {
            createdByLogin: user.dataValues.login,
            createdByAvatarUrl: user.dataValues.avatar_url,
            isOwner: true,
            modulesCount: 0} );
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

        /*Удалить все закладки на папку*/
        const bookmarks = await BookmarFolderModel.findAll({ where:{ folder_id: folderId }  })
        const deleteBookmarkPromises = bookmarks.map(item => item.destroy())
        await Promise.all(deleteBookmarkPromises)

        await folder.destroy()
        return {}
    }

    async getModules(folderId: number, userId: number) {
        const folder = await FolderModel.findOne({ where: { id: folderId } })
        if (!folder) throw ApiError.BadRequest(`Папка с id=${folderId} не найдена`);

        if (folder.user_id !== userId && !folder.dataValues.is_published) throw ApiError.BadRequest(`Папка с id=${folderId} не публичная`);

        let modules: ModuleModel[] = []
        if (folder.user_id === userId) {
            modules =  await ModuleModel.findAll({ where: { folder_id: folderId, user_id: userId } })
        } else modules =  await ModuleModel.findAll({ where: { folder_id: folderId, is_published: true } })

        let moduleDtos: ModuleDto[] = []
        for (let module of modules) {
            const cards = await CardModel.findAll({where: { module_id: module.id }})
            const { createdByLogin, createdByAvatarUrl, isOwner } = await module.getUser()
            .then(user => {
                return {
                    createdByLogin: user.dataValues.login,
                    createdByAvatarUrl: user.dataValues.avatar_url,
                    isOwner: user.dataValues.id === userId ? true : false
                }
            })
            moduleDtos.push(new ModuleDto( module, { cardsCount: cards.length, createdByLogin, createdByAvatarUrl, isOwner }))
        }

        return { modules: moduleDtos }
    }

    async getFolders(userId: number, query: IGetFoldersQuery) {
        const folders = await FolderModel.findAll({ where: { user_id: userId } })
        const { folderBookmarks } = await bookmarkFolderService.getBookmarks(userId)

       const userFolders = [...folders, ...folderBookmarks]
       let folderDtos: FolderDto[] = []

       for (let folder of userFolders) {
         const modules = await ModuleModel.findAll({where: { folder_id: folder.dataValues.id }})
         const { createdByLogin, createdByAvatarUrl, isOwner } = await folder.getUser().then(user => ({
            createdByLogin: user.dataValues.login,
            createdByAvatarUrl: user.dataValues.avatar_url,
            isOwner: user.dataValues.id === userId ? true : false
        }))
        const isBookmarked = folderBookmarks.find(item => item.id === folder.id) ? true : false
         folderDtos.push(new FolderDto(folder, { modulesCount: modules.length, isBookmarked, createdByLogin, createdByAvatarUrl, isOwner }))
        }

        folderDtos = this.filterFolders(folderDtos, query)
        return { folders: folderDtos }
    }

    async getPublicFolders(userId: number, query: IGetFoldersQuery) {
        const bookmarks = await bookmarkFolderService.getBookmarks(userId)

        const folders = await FolderModel.findAll({ where: { is_published: true } })
        let folderDtos: FolderDto[] = []

        for (let folder of folders) {
            const modules = await ModuleModel.findAll({where: { folder_id: folder.dataValues.id }})
            const { createdByLogin, createdByAvatarUrl, isOwner } = await folder.getUser().then(user => ({
                createdByLogin: user.dataValues.login,
                createdByAvatarUrl: user.dataValues.avatar_url,
                isOwner: user.dataValues.id === userId ? true : false
            }))
            const isBookmarked = bookmarks.folderBookmarks.find(item => item.id === folder.id) ? true : false
            folderDtos.push(new FolderDto(folder, { modulesCount: modules.length, isBookmarked, createdByLogin, createdByAvatarUrl, isOwner }))
        }

        folderDtos = this.filterFolders(folderDtos, query)
        return { folders: folderDtos }
    }

    private filterFolders(folderDtos: FolderDto[], query: IGetFoldersQuery ): FolderDto[] {

        const { by_alphabet: byAlphabet, by_search: bySearch, by_updated_date: byUpdatedDate } = query

        if (bySearch) {
            folderDtos = folderDtos.filter( folder => {
                const name = folder.name?.toLowerCase()
                const description = folder.description?.toLowerCase()
                const s = bySearch.toLowerCase()
                return ( name?.includes(s) || description?.includes(s) ) ? true : false
            })
        }

        if (byAlphabet) {
            folderDtos = folderDtos.sort( (a, b) => {
                return (byAlphabet === 'asc') ?
                    ( a.name > b.name ? 1 : -1 ) :
                    ( a.name > b.name ? -1 : 1 )
            } )
        }

        if (byUpdatedDate) {
            folderDtos = folderDtos.sort( (a, b) => {
                const a_time = a.updatedAt?.getTime()
                const b_time = b.updatedAt?.getTime()

                if (!a_time || !b_time) return -1

                return (byUpdatedDate === 'asc') ?
                    ( a_time > b_time ? 1 : -1 ) :
                    ( a_time > b_time ? -1 : 1 )
            } )
        }

        return folderDtos
    }



    /*Добавление модуля в папку*/
    async addModule(userId: number, moduleId: number, folderId: number) {
        /*Проверить наличие модуля
        Проверить наличия папки
        Проверить, что пользователь является владельцем модуля и папки*/
        const module = await ModuleModel.findOne({ where: { id: moduleId } })
        if (!module) throw ApiError.BadRequest(`Модуль с id=${moduleId} не найден`);

        const folder = await FolderModel.findOne({ where: { id: folderId } })
        if (!folder) throw ApiError.BadRequest(`Папка с id=${folderId} не найдена`);

        if (module.dataValues.user_id !== userId) throw ApiError.BadRequest(`Пользователь не является владельцем модуля`);
        if (folder.dataValues.user_id !== userId) throw ApiError.BadRequest(`Пользователь не является владельцем папки`);

        module.folder_id = folder.dataValues.id
        await module.save()
        return { }
    }

    async removeModule(userId: number, moduleId: number, folderId: number) {
        /*Проверить наличие модуля
        Проверить наличия папки
        Проверить, что пользователь является владельцем модуля и папки*/
        const module = await ModuleModel.findOne({ where: { id: moduleId } })
        if (!module) throw ApiError.BadRequest(`Модуль с id=${moduleId} не найден`);

        const folder = await FolderModel.findOne({ where: { id: folderId } })
        if (!folder) throw ApiError.BadRequest(`Папка с id=${folderId} не найдена`);

        if (module.dataValues.user_id !== userId) throw ApiError.BadRequest(`Пользователь не является владельцем модуля`);
        if (folder.dataValues.user_id !== userId) throw ApiError.BadRequest(`Пользователь не является владельцем папки`);

        //@ts-ignore
        module.folder_id = null
        await module.save()
        return { }
    }

}

export default new FolderService();
