import { Router } from 'express'
import { query } from 'express-validator'
import globalSearchController from 'controllers/global-search-controller'

const globalSearchRouter = Router();

globalSearchRouter.get('/',
    query('by_type').notEmpty().isString().custom((value) => {
        if (value === 'modules' || value === 'folders' || value === 'all') return true
        return false
    }).withMessage('Для параметра by_type допустмы только значения modules, folders, all'),

    query('by_search').optional().isString().isLength({ max: 512 }),

    query('by_alphabet').optional().isString().custom((value) => {
        if (value === 'asc' || value === 'desc') return true
        return false
    }).withMessage('Для параметра by_alphabet допустмы только значения asc, desc'),

    query('by_updated_date').optional().isString().custom((value) => {
        if (value === 'asc' || value === 'desc') return true
        return false
    }).withMessage('Для параметра by_updated_date допустмы только значения asc, desc'),

    globalSearchController.search
);

export default globalSearchRouter