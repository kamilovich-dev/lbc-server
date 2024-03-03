import { Router } from 'express'
import { body } from 'express-validator'
import moduleController from 'controllers/module-controller'

const moduleRouter = Router();

moduleRouter.post('/create',
    body('name').notEmpty(),
    body('description').optional(),
    moduleController.create
);

moduleRouter.post('/update',
    body('moduleId').notEmpty(),
    body('name').notEmpty(),
    body('description').optional(),
    body('isFavorite').optional().isBoolean(),
    body('isPublished').optional().isBoolean(),
    moduleController.update
);

moduleRouter.post('/remove',
    body('moduleId').notEmpty(),
    moduleController.remove
);

moduleRouter.post('/add-to-folder',
    body('moduleId').notEmpty().isNumeric(),
    body('folderId').notEmpty().isNumeric(),
    moduleController.addToFolder
)

moduleRouter.get('/',
    moduleController.getModules
);

moduleRouter.get('/public',
    moduleController.getPublicModules
);

export default moduleRouter