import { personal_dataAttributes } from 'models/personal_data'

class PersonalDto {

    userId: personal_dataAttributes['user_id'];
    avatarUrl: personal_dataAttributes['avatar_url'];
    firstName: personal_dataAttributes['first_name'];
    lastName: personal_dataAttributes['last_name'];
    fatherName: personal_dataAttributes['father_name'];
    birthDate: personal_dataAttributes['birth_date'];

    constructor(model: personal_dataAttributes) {
        this.userId = model.user_id;
        this.avatarUrl = model.avatar_url;
        this.firstName = model.first_name;
        this.lastName = model.last_name;
        this.fatherName = model.father_name;
        this.birthDate = model.birth_date;
    }
}

export default PersonalDto