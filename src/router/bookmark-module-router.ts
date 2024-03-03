import { Router } from 'express'
import { body, check } from 'express-validator'
import bookmarkModuleController from 'controllers/bookmark-module-controller'

const bookmarkModuleRouter = Router();

bookmarkModuleRouter.post('/create',
    body('moduleId').notEmpty().isNumeric(),
    bookmarkModuleController.create
);

bookmarkModuleRouter.post('/remove',
    body('bookmarkId').notEmpty().isNumeric(),
    bookmarkModuleController.remove
);

bookmarkModuleRouter.get('/', bookmarkModuleController.getBookmarks)

export default bookmarkModuleRouter