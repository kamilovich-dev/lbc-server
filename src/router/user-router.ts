import { Router } from 'express'
import { body } from 'express-validator'
import userController from 'controllers/user-controller'
import authMiddleware from 'middlewares/auth-middleware'

const userRouter = Router();

userRouter.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 4, max: 64}),
    userController.registration
);
userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);
userRouter.get('/activate/:link', userController.activate);
userRouter.get('/refresh-token', userController.refresh);
userRouter.get('/', authMiddleware, userController.getUsers);

export default userRouter