import { Router } from 'express'
import { body, check } from 'express-validator'
import fileUploadMiddleware from 'express-fileupload'
import personalController from 'controllers/personal-controller'
import { isIsoDate } from 'utils/date'

const personalRouter = Router()

personalRouter.get('/', personalController.getPersonalData)
personalRouter.post('/create', personalController.create)
personalRouter.post('/update',
    fileUploadMiddleware(),
    body('first_name').notEmpty().isLength({min: 1, max: 64}),
    body('last_name').optional().isLength({min: 0, max: 64}),
    body('father_name').optional().isLength({min: 0, max: 64}),
    body('birth_date').custom((value, req) => {
        if (value === undefined || value === 'null') return true
        const pattern = /^\d{4}-\d{2}-\d{2}$/;
        return pattern.test(value);
    }),
    body('avatar_url').optional().custom((value, {req}) => {
        return (value === 'null') ? true : false
    }).withMessage('Для avatar_url доступно только значение null'),
    body('avatar_file').custom((value, {req}) => {
        const avatar_file = req.files?.avatar_file
        if (!avatar_file) return true

        const mimetype = avatar_file.mimetype
        if (mimetype === 'image/png'
            || mimetype === 'image/jpg'
                || mimetype === 'image/jpeg') return true
        return false
    }).withMessage('Неверный тип файла аватара'),
    personalController.update
);



export default personalRouter