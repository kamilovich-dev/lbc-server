import * as dotenv from 'dotenv'
dotenv.config()

import { createClient } from 'redis'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from 'router/user-router'
import moduleRouter from 'router/module-router'
import cardRouter from 'router/card-router'
import personalRouter from 'router/personal-router'
import bookmarkModuleRouter from 'router/bookmark-module-router'
import bookmarkFolderRouter from 'router/bookmark-folder-router'
import folderRouter from 'router/folder-router'
import errorMiddleware from 'middlewares/error-middleware'
import authMiddleware from 'middlewares/auth-middleware'
import { initDb } from './db'
import morgnamMiddleware from "lib/morgan-middleware";

const PORT = process.env.PORT || 9999;
const STATIC_PATH = process.env.STATIC_PATH || 'static'
const app = express();
export const redisClient = createClient()

app.use(morgnamMiddleware)
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

app.use('/api/user',
    userRouter);

app.use('/api/personal',
    authMiddleware,
    personalRouter)

app.use('/api/module',
    authMiddleware,
    moduleRouter);

app.use('/api/card',
    authMiddleware,
    cardRouter);

app.use('/api/bookmark-module',
    authMiddleware,
    bookmarkModuleRouter)

app.use('/api/bookmark-folder',
    authMiddleware,
    bookmarkFolderRouter)

app.use('/api/folder',
    authMiddleware,
    folderRouter)

app.use(express.static(STATIC_PATH))

app.use(errorMiddleware);


const startServer = async () => {
    try {
        await redisClient.connect()
        await initDb()
        app.listen(PORT, () => console.log(`Сервер запущен PORT=${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

startServer()