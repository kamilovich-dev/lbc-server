import { Router } from 'express'
import { body } from 'express-validator'
import folderController from 'controllers/folder-controller'

const folderRouter = Router();

folderRouter.post('/create',
    body('name').notEmpty().isString().isLength({min: 1, max: 64}),
    folderController.create
);

folderRouter.post('/update',
    body('folderId').notEmpty().isNumeric(),
    body('name').notEmpty().isString().isLength({min: 1, max: 64}),
    body('description').optional().isString().isLength({min: 1, max: 128}),
    body('isPublished').optional().isBoolean(),
    folderController.update
);

folderRouter.post('/remove',
    body('folderId').notEmpty().isNumeric(),
    folderController.remove
);

folderRouter.get('/', folderController.getFolders);

folderRouter.get('/public', folderController.getPublicFolders);


export default folderRouter