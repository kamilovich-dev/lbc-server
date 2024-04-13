import { Router } from 'express'
import { body, check } from 'express-validator'
import fileUploadMiddleware from 'express-fileupload'
import personalController from 'controllers/personal-controller'

const personalRouter = Router()

personalRouter.get('/', personalController.getPersonalData)
personalRouter.post('/update',
    body('firstName').optional().isLength({ max: 64}),
    body('lastName').optional().isLength({ max: 64}),
    body('fatherName').optional().isLength({ max: 64}),
    body('birthDate').optional().custom((value, req) => {
        if (value === undefined || value === '') return true
        const pattern = /^\d{4}-\d{2}-\d{2}$/;
        return pattern.test(value);
    }),
    personalController.update
);



export default personalRouter