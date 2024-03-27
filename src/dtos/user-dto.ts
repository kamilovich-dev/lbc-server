import { user, userAttributes } from 'models/user'

class UserDto {

    id: userAttributes['id'];
    email: userAttributes['email'];
    login: userAttributes['login']
    isActivated: userAttributes['is_activated'];
    avatarUrl: userAttributes['avatar_url']

    constructor(model: userAttributes) {
        this.id = model.id;
        this.email = model.email;
        this.login = model.login
        this.isActivated = model.is_activated;
        this.avatarUrl = model.avatar_url
    }
}

export default UserDto