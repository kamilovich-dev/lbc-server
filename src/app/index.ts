import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from 'router/user-router'
import moduleRouter from 'router/module-router'
import cardRouter from 'router/card-router'
import errorMiddleware from 'middlewares/error-middleware'
import dbMiddleware from 'middlewares/db-middleware'
import authMiddleware from 'middlewares/auth-middleware'

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
    dbMiddleware,
    userRouter);

app.use('/api/module',
    authMiddleware,
    dbMiddleware,
    moduleRouter);

app.use('/api/card',
    authMiddleware,
    dbMiddleware,
    cardRouter);

app.use(express.static(STATIC_PATH))

app.use(errorMiddleware);

const startServer = async () => {
    try {
        app.listen(PORT, () => console.log(`Сервер запущен PORT=${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

startServer()