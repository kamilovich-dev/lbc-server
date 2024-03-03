import { folderAttributes } from 'models/folder'
import ModuleDto from './module-dto';

class FolderDto {

    id: folderAttributes['id'];
    name: folderAttributes['name'];
    isPublished: folderAttributes['is_published']
    description: folderAttributes['description'];
    createdAt?: Date
    updatedAt?: Date

    constructor(model: folderAttributes, cardsCount?: number) {

        this.id = model.id;
        this.name = model.name;
        this.description = model.description
        this.isPublished = model.is_published
        this.createdAt = model.createdAt
        this.updatedAt = model.updatedAt
    }
}

export default FolderDto