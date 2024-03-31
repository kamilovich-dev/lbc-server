import { folderAttributes } from 'models/folder'
import ModuleDto from './module-dto';

interface IFolderDtoOptions {
    modulesCount?: number,
    isBookmarked?: boolean,
    createdByLogin?: string,
    createdByAvatarUrl?: string,
    isOwner?: boolean,
}

class FolderDto {

    id: folderAttributes['id'];
    name: folderAttributes['name'];
    isPublished: folderAttributes['is_published']
    description: folderAttributes['description'];
    createdAt?: Date
    updatedAt?: Date

    options?: IFolderDtoOptions


    constructor(model: folderAttributes, options?: IFolderDtoOptions) {

        this.id = model.id;
        this.name = model.name;
        this.description = model.description
        this.isPublished = model.is_published
        this.createdAt = model.createdAt
        this.updatedAt = model.updatedAt

        this.options = { ...options }
    }
}

export default FolderDto