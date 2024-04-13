import { folder as FolderModel } from 'models/folder'
import { module as ModuleModel } from 'models/module'
import FolderDto from 'dtos/folder-dto'
import ApiError from 'exceptions/api-error'
import { card as CardModel } from 'models/card'
import bookmarkFolderService from './bookmark-folder-service'
import { bookmark_folder as BookmarFolderModel } from 'models/bookmark_folder'
import ModuleDto from 'dtos/module-dto'
import { Op } from 'sequelize'

export interface IGetFoldersQuery {
    by_search?: string,
    by_alphabet?: 'asc' | 'desc',
    by_updated_date?: 'asc' | 'desc',
}

class FolderService {

    async create(userId:number, name: string, description: string) {
        const folder = await FolderModel.create({name, description, user_id: userId, module_ids: []});
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
            modules =  await ModuleModel.findAll({ where: { id: folder.module_ids } })
        } else modules =  await ModuleModel.findAll({ where: { id: folder.module_ids, is_published: true } })

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
         const modules = await ModuleModel.findAll({where: { id: folder.module_ids }})
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

    /*Возвращаем все папки, в которых есть модуль*/
    async getFoldersByModule(userId: number, moduleId: number) {

        const module = await ModuleModel.findOne({where: { id: moduleId }})
        if (!module) throw ApiError.BadRequest(`Модуль не существует`);

        const folders = await FolderModel.findAll({ where: { user_id: userId } })
        const { folderBookmarks } = await bookmarkFolderService.getBookmarks(userId)

       let userFolders = [...folders, ...folderBookmarks]
       let folderDtos: FolderDto[] = []

       userFolders = userFolders.filter(folder => folder.module_ids?.includes(moduleId))

       for (let folder of userFolders) {
         const modules = await ModuleModel.findAll({where: { id: folder.module_ids }})
         const { createdByLogin, createdByAvatarUrl, isOwner } = await folder.getUser().then(user => ({
            createdByLogin: user.dataValues.login,
            createdByAvatarUrl: user.dataValues.avatar_url,
            isOwner: user.dataValues.id === userId ? true : false
         }))
         const isBookmarked = folderBookmarks.find(item => item.id === folder.id) ? true : false
         folderDtos.push(new FolderDto(folder, { modulesCount: modules.length, isBookmarked, createdByLogin, createdByAvatarUrl, isOwner }))
        }

        return { folders: folderDtos }
    }

    async getFolder(userId: number, folderId: number) {
        const folder = await FolderModel.findOne({where: { id: folderId }})

        if (!folder) throw ApiError.BadRequest(`Папка не найдена`);
        if (!folder?.is_published && folder.dataValues.user_id !== userId) throw ApiError.BadRequest(`Папка не опубликована`);

        const { folderBookmarks } = await bookmarkFolderService.getBookmarks(userId)

        const modules = await ModuleModel.findAll({where: { id: folder.module_ids }})
        const { createdByLogin, createdByAvatarUrl, isOwner } = await folder.getUser().then(user => ({
            createdByLogin: user.dataValues.login,
            createdByAvatarUrl: user.dataValues.avatar_url,
            isOwner: user.dataValues.id === userId ? true : false
        }))
        const isBookmarked = folderBookmarks.find(item => item.id === folder.id) ? true : false
        const folderDto = new FolderDto(folder, { modulesCount: modules.length, isBookmarked, createdByLogin, createdByAvatarUrl, isOwner })

        return { folder: folderDto }
    }

    async getPublicFolders(userId: number, query: IGetFoldersQuery) {
        const bookmarks = await bookmarkFolderService.getBookmarks(userId)

        const folders = await FolderModel.findAll({ where: { is_published: true } })
        let folderDtos: FolderDto[] = []

        for (let folder of folders) {
            const modules = await ModuleModel.findAll({where: { id: folder.module_ids }})
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

    /*Добавление модулей в папку*/
    async addModules(userId: number, moduleIds: number[], folderId: number) {

        const folder = await FolderModel.findOne({ where: { id: folderId } })
        if (!folder) throw ApiError.BadRequest(`Папка с id=${folderId} не найдена`);

        if (folder.user_id !== userId) throw ApiError.BadRequest(`Нельзя редактировать чужую папку`);

        const modules = await ModuleModel.findAll({ where: { id: moduleIds } })
        //Чужая папка - нельзя
        //Своя папка - можно
        if (modules.length !== moduleIds.length) throw ApiError.BadRequest(`Попытка добавить несуществующие модули`);

        //Чужой модуль - можно, если опубликован
        //Свой модуль - можно
        const moduleIdsToAdd = []
        for (let module of modules) {
            if (module.user_id !== userId && !module.is_published) throw ApiError.BadRequest(`Нельзя добавить чужой неопубликованный модуль`);
            moduleIdsToAdd.push(module.id)
        }

        folder.module_ids = moduleIdsToAdd
        await folder.save()
        return { }
    }

    async addModule(userId: number, folderIds: number[], moduleId: number) {

        const module = await ModuleModel.findOne({where: { id: moduleId }})
        if (!module) throw ApiError.BadRequest(`Модуль с id=${moduleId} не найден`);

        if (module.user_id !== userId && !module.is_published) throw ApiError.BadRequest(`Нельзя добавить чужой неопубликованный модуль`);

        const folders = await FolderModel.findAll({ where: { id: folderIds } })
        if (folders.length !== folderIds.length) throw ApiError.BadRequest(`Попытка добавить модуль в несуществующие папки`);

        const isThereNotMyFolder = folders.find(folder => folder.user_id !== userId) ? true : false
        if (isThereNotMyFolder) throw ApiError.BadRequest(`Попытка добавить модуль в чужую папку`);

        for (let folder of folders) {
            folder.module_ids = folder.module_ids ?? []
            const idx = folder.module_ids?.findIndex(id => id === moduleId)
            if (idx === -1) {
                const moduleIds = [...folder.module_ids]
                moduleIds?.push(moduleId)
                folder.module_ids = moduleIds
                await folder.save()
            }
        }

        const allUserFolders = await FolderModel.findAll({where: {user_id: userId}})
        const doesntProcessedFolders = allUserFolders.filter(folder => folders.find(item => item.id === folder.id) === undefined) /*Берем необработанные папки*/

        for (let folder of doesntProcessedFolders) {
            folder.module_ids = folder.module_ids ?? []
            const idx = folder.module_ids?.findIndex(id => id === moduleId)
            if (idx !== -1) {
                const moduleIds = [...folder.module_ids]
                moduleIds.splice(idx, 1)
                folder.module_ids = moduleIds
                await folder.save()
            }
        }

        return { }
    }

}

export default new FolderService();
