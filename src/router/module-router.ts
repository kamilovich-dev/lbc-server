import { Router } from 'express'
import { body } from 'express-validator'
import moduleController from 'controllers/module-controller'

const moduleRouter = Router();

moduleRouter.post('/create',
    body('userId').notEmpty(),
    body('name').notEmpty(),
    body('description').optional(),
    moduleController.create
);

moduleRouter.post('/update',
    body('moduleId').notEmpty(),
    body('name').notEmpty(),
    body('description').optional(),
    moduleController.update
);

moduleRouter.post('/remove',
    body('moduleId').notEmpty(),
    moduleController.remove
);

moduleRouter.get('/',
    body('userId').notEmpty(),
    moduleController.getModules
);

export default moduleRouter