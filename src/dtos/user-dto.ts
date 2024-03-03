import { user, userAttributes } from 'models/user'

class UserDto {

    id: userAttributes['id'];
    email: userAttributes['email'];
    login: userAttributes['login']
    isActivated: userAttributes['is_activated'];

    constructor(model: userAttributes) {
        this.id = model.id;
        this.email = model.email;
        this.login = model.login
        this.isActivated = model.is_activated;
    }
}

export default UserDto