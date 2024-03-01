import { Router } from 'express'
import { body } from 'express-validator'
import userController from 'controllers/user-controller'

const userRouter = Router();

userRouter.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 64}),
    userController.registration
);
userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);
userRouter.post('/password_forgot',
    body('email').isEmail().notEmpty(),
    userController.passwordForgot
)
userRouter.post('/password_reset',
     body('email').notEmpty().isEmail(),
     body('password').notEmpty().isLength({min: 6, max: 64}),
     body('token').notEmpty().isLength({min: 32, max: 32}),
     userController.passwordReset
)
userRouter.get('/activate/:link', userController.activate);
userRouter.get('/refresh_token', userController.refresh);
userRouter.get('/', userController.getUsers);

export default userRouter