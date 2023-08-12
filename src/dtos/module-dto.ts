import { moduleAttributes } from 'models/module'

class ModuleDto {

    id: moduleAttributes['id'];
    name: moduleAttributes['name'];
    description: moduleAttributes['description'];

    constructor(model: moduleAttributes) {
        this.id = model.id;
        this.name = model.name;
        this.description = model.description;
    }
}

export default ModuleDto