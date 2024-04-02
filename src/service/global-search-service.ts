import { folder as FolderModel } from 'models/folder'
import { module as ModuleModel } from 'models/module'
import FolderDto from 'dtos/folder-dto'
import ApiError from 'exceptions/api-error'
import { card as CardModel } from 'models/card'
import bookmarkFolderService from './bookmark-folder-service'
import { bookmark_folder as BookmarFolderModel } from 'models/bookmark_folder'
import ModuleDto from 'dtos/module-dto'
import moduleService from './module-service'
import folderService from './folder-service'

export interface IGlobalSearchQuery {
    by_search?: string,
    by_alphabet?: 'asc' | 'desc',
    by_updated_date?: 'asc' | 'desc',
    by_type: 'modules' | 'folders' | 'all'
}

class GlobalSearchService {

    async search(userId: number, query: IGlobalSearchQuery) {

        let modules: ModuleDto[] = []
        let folders: FolderDto[] = []

        const { by_type } = query
        if (by_type === 'modules' || by_type === 'all') modules = await moduleService.getPublicModules(userId, query).then(result => result.modules)
        if (by_type === 'folders' || by_type === 'all') folders = await folderService.getPublicFolders(userId, query).then(result => result.folders)

        return { modules, folders }
    }

}

export default new GlobalSearchService();
