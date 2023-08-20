import { moduleAttributes } from 'models/module'

class ModuleDto {

    id: moduleAttributes['id'];
    name: moduleAttributes['name'];
    description: moduleAttributes['description'];
    cardsCount?: number

    constructor(model: moduleAttributes, cardsCount?: number) {
        this.id = model.id;
        this.name = model.name;
        this.description = model.description;
        this.cardsCount = cardsCount
    }
}

export default ModuleDto