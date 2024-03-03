import  userService from 'service/user-service'
import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express';
import { refreshTokenExpires } from 'service/token-service';
import ApiError from 'exceptions/api-error'
import UserDto from 'dtos/user-dto';

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {email, login, password} = req.body;
            if (!email && !login) {
                return next(ApiError.BadRequest('Укажите логин или email'))
            }
            const userData = await userService.registration(email, login, password);
            return res.json(userData);
        } catch(e) {
            next(e);
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL!);
        } catch(e) {
            next(e);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, login, password} = req.body;
            if (!email && !login) {
                return next(ApiError.BadRequest('Укажите логин или email'))
            }
            const userData = await userService.login(email, login, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: refreshTokenExpires, httpOnly: true})
            return res.json({
                user: userData.user,
                accessToken: userData.accessToken
            });
        } catch(e) {
            next(e);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            if (refreshToken) await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json( {} );
        } catch(e) {
            next(e);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: refreshTokenExpires, httpOnly: true})
            return res.json({
                user: userData.user,
                accessToken: userData.accessToken
            });
        } catch(e) {
            next(e);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getUsers();
            const userDtos: UserDto[] = []
            for (let user of users) {
                userDtos.push(new UserDto(user))
            }
            return res.json( { users: userDtos });
        } catch(e) {
            next(e);
        }
    }

    async passwordForgot(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { email, login } = req.body
            if (!email && !login) {
                return next(ApiError.BadRequest('Укажите логин или email'))
            }
            await userService.passwordForgot(email, login)
            return res.json({success: true, message: 'Проверьте почту'})
        } catch(e) {
            next(e)
        }
    }

    async passwordReset(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { email, password, token } = req.body
            const data = await userService.passwordReset(email, password, token)
            return res.json({success: true, message: 'Пароль изменен', data})
        } catch(e) {
            next(e)
        }
    }
}

export default new UserController();