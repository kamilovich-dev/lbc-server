import { Router } from 'express'
import { body, check } from 'express-validator'
import fileUploadMiddleware from 'express-fileupload'
import personalController from 'controllers/personal-controller'

const personalRouter = Router()

personalRouter.get('/', personalController.getPersonalData)
personalRouter.post('/create', personalController.create)
personalRouter.post('/update',
    fileUploadMiddleware(),
    body('firstName').notEmpty().isLength({min: 1, max: 64}),
    body('lastName').optional().isLength({min: 0, max: 64}),
    body('fatherName').optional().isLength({min: 0, max: 64}),
    body('birthDate').custom((value, req) => {
        if (value === undefined || value === 'null') return true
        const pattern = /^\d{4}-\d{2}-\d{2}$/;
        return pattern.test(value);
    }),
    body('avatarUrl').optional().custom((value, {req}) => {
        return (value === 'null') ? true : false
    }).withMessage('Для avatar_url доступно только значение null'),
    body('avatarFile').custom((value, {req}) => {
        const avatarFile = req.files?.avatarFile
        if (!avatarFile) return true

        const mimetype = avatarFile.mimetype
        if (mimetype === 'image/png'
            || mimetype === 'image/jpg'
                || mimetype === 'image/jpeg') return true
        return false
    }).withMessage('Неверный тип файла аватара'),
    personalController.update
);



export default personalRouter