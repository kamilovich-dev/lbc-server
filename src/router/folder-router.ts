import { Router } from 'express'
import { body, query } from 'express-validator'
import folderController from 'controllers/folder-controller'

const folderRouter = Router();

folderRouter.post('/create',
    body('name').notEmpty().isString().isLength({min: 1, max: 64}),
    folderController.create
);

folderRouter.post('/update',
    body('folderId').notEmpty().isNumeric(),
    body('name').optional().isString().isLength({ max: 64}),
    body('description').optional().isString().isLength({ max: 128}),
    body('isPublished').optional().isBoolean(),
    folderController.update
);

folderRouter.post('/add-module',
    body('moduleId').notEmpty().isNumeric(),
    body('folderId').notEmpty().isNumeric(),
    folderController.addModule
)

folderRouter.post('/remove-module',
    body('moduleId').notEmpty().isNumeric(),
    body('folderId').notEmpty().isNumeric(),
    folderController.removeModule
)


folderRouter.get('/',
    query('by_search').optional().isString().isLength({ max: 512 }),
    query('by_alphabet').optional().isString().custom((value) => {
        if (value === 'asc' || value === 'desc') return true
        return false
    }).withMessage('Для параметра by_alphabet допустмы только значения asc, desc'),
    query('by_updated_date').optional().isString().custom((value) => {
        if (value === 'asc' || value === 'desc') return true
        return false
    }).withMessage('Для параметра by_updated_date допустмы только значения asc, desc'),
    folderController.getFolders);


folderRouter.get('/public',
    query('by_search').optional().isString().isLength({ max: 512 }),
    query('by_alphabet').optional().isString().custom((value) => {
        if (value === 'asc' || value === 'desc') return true
        return false
    }).withMessage('Для параметра by_alphabet допустмы только значения asc, desc'),
    query('by_updated_date').optional().isString().custom((value) => {
        if (value === 'asc' || value === 'desc') return true
        return false
    }).withMessage('Для параметра by_updated_date допустмы только значения asc, desc'),
    folderController.getPublicFolders);

folderRouter.post('/remove',
    body('folderId').notEmpty().isNumeric(),
    folderController.remove
);


export default folderRouter