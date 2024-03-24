import { Router } from 'express'
import { body } from 'express-validator'
import cardController from 'controllers/card-controller'
import fileUploadMiddleware from 'express-fileupload'

const cardRouter = Router();

cardRouter.post('/create',
    body('moduleId').notEmpty().isNumeric(),
    body('term').notEmpty().isString().isLength({ min: 1, max: 1024 }),
    body('definition').notEmpty().isString().isLength({ min: 1, max: 1024 }),
    body('isFavorite').optional().isBoolean(),
    cardController.create
);

cardRouter.post('/update',
    fileUploadMiddleware(),
    body('cardId').notEmpty().isNumeric(),
    body('term').optional().isLength({ max: 1024 }),
    body('definition').optional().isLength({ max: 1024 }),
    body('isFavorite').optional().isBoolean(),
    body('imgFile').custom((value, { req }) => {
        const imgFile = req.files?.imgFile
        if (!imgFile) return true

        const mimetype = imgFile.mimetype
        if (mimetype === 'image/png'
            || mimetype === 'image/jpg'
                || mimetype === 'image/jpeg') return true
        return false
    }).withMessage('Неверный тип изображения'),
    body('imgUrl').optional().custom((value, {req}) => {
        return (value === 'null') ? true : false
    }).withMessage('Для imgUrl доступно только значение null'),
    cardController.update
);

cardRouter.post('/remove',
    body('cardId').notEmpty().isNumeric(),
    cardController.remove
);

cardRouter.post('/switch-order',
    body('cardId1').notEmpty().isNumeric(),
    body('cardId2').notEmpty().isNumeric(),
    cardController.switchOrder
)

cardRouter.post('/',
    body('moduleId').notEmpty().isNumeric(),
    cardController.getCards
);

export default cardRouter