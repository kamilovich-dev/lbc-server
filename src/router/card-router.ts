import { Router } from 'express'
import { body } from 'express-validator'
import cardController from 'controllers/card-controller'

const cardRouter = Router();

cardRouter.post('/create',
    body('moduleId').notEmpty(),
    body('term').notEmpty(),
    body('definition').notEmpty(),
    body('isFavorite').optional(),
    cardController.create
);

cardRouter.post('/update',
    body('cardId').notEmpty(),
    body('term').optional(),
    body('definition').optional(),
    body('isFavorite').optional(),
    cardController.update
);

cardRouter.post('/remove',
    body('cardId').notEmpty(),
    cardController.remove
);

cardRouter.get('/',
    body('moduleId').notEmpty(),
    cardController.getCards
);

export default cardRouter