import { personal_dataAttributes } from 'models/personal_data'

class PersonalDto {

    user_id: personal_dataAttributes['user_id'];
    avatar_url: personal_dataAttributes['avatar_url'];
    first_name: personal_dataAttributes['first_name'];
    last_name: personal_dataAttributes['last_name'];
    father_name: personal_dataAttributes['father_name'];
    birth_date: personal_dataAttributes['birth_date'];

    constructor(model: personal_dataAttributes) {
        this.user_id = model.user_id;
        this.avatar_url = model.avatar_url;
        this.first_name = model.first_name;
        this.last_name = model.last_name;
        this.father_name = model.father_name;
        this.birth_date = model.birth_date;
    }
}

export default PersonalDto