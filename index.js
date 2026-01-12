import express, { Router } from 'express'
import dotenv from 'dotenv/config'

import cors from 'cors'


import { db } from './config/sqldb.js';
import authroutes from './routes/authroutes.js'
import cookieParser from 'cookie-parser';



const app = express();









app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authroutes)




app.listen(process.env.PORT, () => {
    console.log(`Server is running ${process.env.PORT}`)

    db
})