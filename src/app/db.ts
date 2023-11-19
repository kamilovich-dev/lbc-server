import { Sequelize } from "sequelize"
import ApiError from 'exceptions/api-error'
import { initModels } from 'models/init-models'

async function initDb() {
    try {
        const db = new Sequelize(process.env.DB_URL!, { logging: false })
        await db.authenticate()
        initModels(db)
        await db.sync();
    } catch(e: unknown) {
        if (e instanceof Error) {
            throw ApiError.DbError('Ошибка при подключении к БД', e);
        }
    }
}

export { initDb }