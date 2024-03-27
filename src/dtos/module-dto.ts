import { moduleAttributes } from 'models/module'

interface IModuleDtoOptions {
    cardsCount?: number,
    isBookmarked?: boolean,
    createdByLogin?: string,
    createdByAvatarUrl?: string,
    isOwner?: boolean,
}

class ModuleDto {

    id: moduleAttributes['id'];
    name: moduleAttributes['name'];
    isPublished: moduleAttributes['is_published']
    description: moduleAttributes['description'];
    userId: moduleAttributes['user_id']
    createdAt?: Date
    updatedAt?: Date

    options?: IModuleDtoOptions

    constructor(model: moduleAttributes, options?: IModuleDtoOptions) {
        this.id = model.id;
        this.name = model.name;
        this.description = model.description
        this.isPublished = model.is_published
        this.userId = model.user_id
        this.createdAt = model.createdAt
        this.updatedAt = model.updatedAt

        this.options = { ...options }
    }
}

export default ModuleDto