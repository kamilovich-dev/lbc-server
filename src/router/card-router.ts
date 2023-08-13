import { Router } from 'express'
import { body, check } from 'express-validator'
import cardController from 'controllers/card-controller'
import fileUploadMiddleware from 'express-fileupload'

const cardRouter = Router();

cardRouter.post('/create',
    body('moduleId').notEmpty(),
    body('term').notEmpty(),
    body('definition').notEmpty(),
    body('isFavorite').optional(),
    cardController.create
);

cardRouter.post('/update',
    fileUploadMiddleware({}),
    check('cardId').notEmpty(),
    check('term').notEmpty(),
    check('definition').notEmpty(),
    check('isFavorite').optional(),
    check('img').optional().custom((value,{req}) => {
        const mimetype = req.files.img.mimetype
        if (mimetype === 'image/png'
            || mimetype === 'image/jpg'
                || mimetype === 'image/jpeg') return true
        return false
    }).withMessage('Неверный тип изображения'),
    cardController.update
);

cardRouter.post('/remove',
    body('cardId').notEmpty(),
    cardController.remove
);

cardRouter.post('/switch_order',
    body('cardId1').notEmpty(),
    body('cardId2').notEmpty(),
    cardController.switchOrder
)

cardRouter.get('/',
    body('moduleId').notEmpty(),
    cardController.getCards
);

export default cardRouter