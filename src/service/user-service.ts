import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import MailService from './mail-service'
import tokenService from './token-service'
import UserDto from 'dtos/user-dto'
import ApiError from 'exceptions/api-error'
import { user as UserModel } from 'models/user'

class UserService {

    async registration(email: string, password: string) {
        const candidate = await UserModel.findOne({ where: { email }, raw: true });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await UserModel.create({email, password: hashPassword, activation_link: activationLink, is_activated: false});
        const mailService = new MailService()
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

        const userDto = new UserDto(user);
        return {user: userDto }
    }

    async activate(activationLink: string) {
        const user = await UserModel.findOne({ where: {activation_link: activationLink} });
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации');
        }
        user.is_activated = true;
        await user.save();
    }

    async login(email: string, password:string) {
        const user = await UserModel.findOne({ where: {email}, raw: true});

        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
        }

        const isPassEquals = await bcrypt.compare(password, user.password!);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto }
    }

    async logout(refreshToken:string) {
        await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken) as UserDto;
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findOne({ where: {id: userData.id }, raw: true });
        const userDto = new UserDto(user!);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto }
    }

    async getUsers() {
        const users = await UserModel.findAll();
        return users;
    }
}

export default new UserService();
