import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import MailService from './mail-service'
import tokenService from './token-service'
import UserDto from 'dtos/user-dto'
import ApiError from 'exceptions/api-error'
import { Md5 } from 'ts-md5'
import { user as UserModel } from 'models/user'
import { redisClient } from 'app/index'
import personalService from './personal-service'
import { UploadedFile } from 'express-fileupload'
import fileService from 'service/file-service'

class UserService {

    async registration(email: string, login:string, password: string) {

        const candidateByEmail = await UserModel.findOne({ where: { email, is_activated: true } })
        if (candidateByEmail) throw ApiError.BadRequest(`Пользователь с email=${email} уже существует`);

        const candidateByLogin = await UserModel.findOne({ where: { login, is_activated: true }})
        if (candidateByLogin) throw ApiError.BadRequest(`Пользователь с login=${login} уже существует`);

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const mailService = new MailService()
        await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/api/user/activate/${activationLink}`);

        const candidate = await UserModel.findOne({ where: { email, login } })
        if (candidate) {
            candidate.email = email
            candidate.login = login
            candidate.password = hashPassword
            candidate.activation_link = activationLink
            await candidate.save()
            return { user:  new UserDto(candidate) }
        } else {
            const user = await UserModel.create({email, login, password: hashPassword, activation_link: activationLink, is_activated: false});
            return {user: new UserDto(user) }
        }
    }

    async activate(activationLink: string) {
        const user = await UserModel.findOne({ where: {activation_link: activationLink} });
        if (!user) throw ApiError.BadRequest('Некорректная ссылка активации');
        user.is_activated = true;
        await user.save();
        await personalService.create(user.dataValues.id)
    }

    async login(email: string, login:string, password:string) {
        const user = email ? await UserModel.findOne({ where: { email }, raw: true })
            : login ?  await UserModel.findOne({ where: { login }, raw: true }) : undefined

        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }

        if (!user.is_activated) {
            throw ApiError.BadRequest('Пользователь не активирован');
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

    private async updatePassword(email: string, password: string) {
        const user = await UserModel.findOne({ where: {email}});

        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
        }

        if (!user.is_activated) {
            throw ApiError.BadRequest('Пользователь не активирован');
        }

        const hashPassword = await bcrypt.hash(password, 3);
        user.password = hashPassword
        await user.save()

        const userDto = new UserDto(user);
        return { user: userDto }
    }

    async passwordForgot(email: string, login: string) {
        const user = email ? await UserModel.findOne({ where: { email }, raw: true })
            : login ? await UserModel.findOne({ where: { login }, raw: true }) : undefined

        if (!user) throw ApiError.BadRequest('Не найден пользователь');

        const hash = Md5.hashStr(`${user.email}${Date.now()}${process.env.SECRET}`)
        const link = `${process.env.CLIENT_URL}/password-reset?token=${hash}&email=${user.email}`
        const key = `password-forgot-${user.email}`
        await redisClient.set(key, hash)
        const mailService = new MailService()
        await mailService.sendForgotPasswordMail(user.email, link);
        return { success: true, message: 'Проверьте почту' }
    }

    async passwordReset(email: string, password: string, token: string) {
        const key = `password-forgot-${email}`
        const hash = await redisClient.get(key)
        if (!hash) throw ApiError.BadRequest(`Token сброса пароля истек 1 `);
        if (hash !== token)  throw ApiError.BadRequest(`Token сброса пароля истек 2`);
        await redisClient.del(key)
        return await this.updatePassword(email, password)
    }

    async updateAvatar(email: string, avatarFile: UploadedFile | undefined, avatarUrl: string | undefined) {

        const user = await UserModel.findOne({ where: { email } })
        if (!user) throw ApiError.BadRequest('Не найден пользователь');

        const result = {
            success: false,
            message: ''
        }
        if (avatarUrl === 'null') {
            if (user.dataValues.avatar_url) await fileService.removeFile(user.dataValues.avatar_url)
            //@ts-ignore
            user.avatar_url = null
            result.success = true
            result.message = 'Аватар удален'
        } else if (avatarFile && email) {
            if (user.dataValues.avatar_url) await fileService.removeFile(user.dataValues.avatar_url)
            const avatarUrl = await fileService.saveFile(avatarFile, email, 'avatar-')
            user.avatar_url = avatarUrl
            result.success = true
            result.message = 'Аватар обнолен'
        }

        await user.save()
        return { ...result }
    }
}

export default new UserService();
