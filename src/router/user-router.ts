import { Router } from 'express'
import { body, check } from 'express-validator'
import userController from 'controllers/user-controller'
import fileUploadMiddleware from 'express-fileupload'
import authMiddleware from 'middlewares/auth-middleware'

const userRouter = Router();

userRouter.post('/registration',
    body('email').isEmail().isLength({min: 3, max:64}),
    body('login').isString().isLength({min: 3, max: 64}),
    body('password').isLength({min: 6, max: 64}),
    userController.registration
);

userRouter.post('/login',
    body('email').optional().isEmail().isString().isLength({ max:64}),
    body('login').optional().isString().isLength({ max:64}),
    body('password').notEmpty().isString().isLength({min: 6, max:64}),
    body().custom((value, { req }) => {
        const { email, login } = req.body
        if (!email && !login) return false
        return true
    }).withMessage('Укажите логин или email'),
    userController.login
)

userRouter.post('/logout', userController.logout);
userRouter.post('/password-forgot',
    body('login').optional().isString().isLength({min: 3, max:64}),
    body('email').optional().isEmail().isLength({min: 3, max:64}),
    body().custom((value, { req }) => {
        const { email, login } = req.body
        if (!email && !login) return false
        return true
    }).withMessage('Укажите логин или email'),
    userController.passwordForgot
)

userRouter.post('/password-reset',
     body('email').notEmpty().isEmail().isLength({min: 3, max:64}),
     body('password').notEmpty().isLength({min: 6, max: 64}),
     body('token').notEmpty().isLength({min: 32, max: 32}),
     userController.passwordReset
)

userRouter.post('/update-avatar',
    authMiddleware,
    fileUploadMiddleware(),
    body('avatarUrl').optional().custom( (value, { req }) => {
        return (value === 'null' ) ? true : false
    }).withMessage('Для avatarUrl доступно только значение null'),
    body('avatarFile').custom((value, {req}) => {
        const avatarFile = req.files?.avatarFile
        if (!avatarFile) return true

        const mimetype = avatarFile.mimetype
        if (mimetype === 'image/png'
            || mimetype === 'image/jpg'
                || mimetype === 'image/jpeg') return true
        return false
    }).withMessage('Неверный тип файла. Допустимо .png, .jpg, .jpeg'),
    body().custom(( value, {req}) => {
        const avatarFile = req.files?.avatarFile
        const avatarUrl = req.body.avatarUrl
        if (!avatarFile && !avatarUrl) return false
        return true
    }).withMessage('Должен быть передан хотя бы один параметр'),
     userController.updateAvatar
)

userRouter.get('/activate/:link', userController.activate);
userRouter.get('/refresh-token', userController.refresh);
userRouter.get('/',
    authMiddleware,
    userController.getUserData);

export default userRouter