import { Router } from 'express'
import { body, check } from 'express-validator'
import bookmarkModuleController from 'controllers/bookmark-module-controller'

const bookmarkModuleRouter = Router();

bookmarkModuleRouter.post('/create',
    body('moduleId').notEmpty().isNumeric(),
    bookmarkModuleController.create
);

bookmarkModuleRouter.post('/remove',
    body('moduleId').notEmpty().isNumeric(),
    bookmarkModuleController.remove
);

export default bookmarkModuleRouter