import { Router } from 'express'
import { body } from 'express-validator'
import bookmarkFolderController from 'controllers/bookmark-folder-controller'

const bookmarkFolderRouter = Router();

bookmarkFolderRouter.post('/create',
    body('folderId').notEmpty().isNumeric(),
    bookmarkFolderController.create
);

bookmarkFolderRouter.post('/remove',
    body('folderId').notEmpty().isNumeric(),
    bookmarkFolderController.remove
);

export default bookmarkFolderRouter