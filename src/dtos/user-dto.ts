import { userAttributes } from 'models/user'

class UserDto {

    id: userAttributes['id'];
    email: userAttributes['email'];
    isActivated: userAttributes['is_activated'];

    constructor(model: userAttributes) {
        this.id = model.id;
        this.email = model.email;
        this.isActivated = model.is_activated;
    }
}

export default UserDto