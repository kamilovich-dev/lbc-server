import { moduleAttributes } from 'models/module'

class ModuleDto {

    id: moduleAttributes['id'];
    name: moduleAttributes['name'];
    isFavorite: moduleAttributes['is_favorite']
    isPublished: moduleAttributes['is_published']
    description: moduleAttributes['description'];
    createdAt?: Date
    updatedAt?: Date
    cardsCount?: number

    constructor(model: moduleAttributes, cardsCount?: number) {
        this.id = model.id;
        this.name = model.name;
        this.description = model.description
        this.isFavorite = model.is_favorite
        this.isPublished = model.is_published
        this.cardsCount = cardsCount
        this.createdAt = model.createdAt
        this.updatedAt = model.updatedAt
    }
}

export default ModuleDto