import { Router } from 'express'
import { body, query } from 'express-validator'
import moduleController from 'controllers/module-controller'

const moduleRouter = Router();

moduleRouter.post('/create',
    body('name').notEmpty().isLength({ min: 1, max: 512 }),
    body('description').optional().isLength({ max: 512 }),
    moduleController.create
);

moduleRouter.post('/',
    body('moduleId').notEmpty().isNumeric(),
    moduleController.getModule
)

moduleRouter.get('/',
    query('by_search').optional().isString().isLength({ max: 512 }),
    query('by_alphabet').optional().isString().custom((value) => {
        if (value === 'asc' || value === 'desc') return true
        return false
    }).withMessage('Для параметра by_alphabet допустмы только значения asc, desc'),
    query('by_updated_date').optional().isString().custom((value) => {
        if (value === 'asc' || value === 'desc') return true
        return false
    }).withMessage('Для параметра by_updated_date допустмы только значения asc, desc'),
    moduleController.getModules
);

moduleRouter.post('/update',
    body('moduleId').notEmpty().isNumeric(),
    body('name').optional().isLength({ max: 512 }),
    body('description').optional().isLength({ max: 512 }),
    body('isPublished').optional().isBoolean(),
    moduleController.update
);

moduleRouter.post('/remove',
    body('moduleId').notEmpty(),
    moduleController.remove
);

export default moduleRouter