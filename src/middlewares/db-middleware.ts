import { Sequelize } from "sequelize"
import ApiError from 'exceptions/api-error'
import { Request, Response, NextFunction } from "express"
import { initModels } from 'models/init-models'

export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        const db = new Sequelize(process.env.DB_URL!, { logging: false })
        await db.authenticate()
        initModels(db)
        await db.sync();
        next()
    } catch(e: unknown) {
        if (e instanceof Error) {
            return next(ApiError.DbError('Ошибка при подключении к БД', e));
        }
    }
}