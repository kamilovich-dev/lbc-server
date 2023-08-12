import  userService from 'service/user-service'
import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express';
import ApiError from 'exceptions/api-error'
import UserDto from 'dtos/user-dto';

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
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
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
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
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
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
}

export default new UserController();