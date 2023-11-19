import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from 'router/user-router'
import moduleRouter from 'router/module-router'
import cardRouter from 'router/card-router'
import errorMiddleware from 'middlewares/error-middleware'
import authMiddleware from 'middlewares/auth-middleware'
import { initDb } from './db'

const PORT = process.env.PORT || 9999;
const STATIC_PATH = process.env.STATIC_PATH || 'static'
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use('/api/user',
    userRouter);

app.use('/api/module',
    authMiddleware,
    moduleRouter);

app.use('/api/card',
    authMiddleware,
    cardRouter);

app.use(express.static(STATIC_PATH))

app.use(errorMiddleware);

const startServer = async () => {
    try {
        await initDb()
        app.listen(PORT, () => console.log(`Сервер запущен PORT=${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

startServer()