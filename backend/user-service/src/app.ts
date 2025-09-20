import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { userRoutes } from './routes/user-route'

dotenv.config()

const app = express()

app.use(cors({
    origin: '*'
}))

//Parsing JSON bodies
app.use(express.json({limit: '50mb'}))

//Parsing URL-encoded bodies
app.use(express.urlencoded({extended: true, limit: '50mb'}))

//Forwarding
app.use('/', userRoutes)

//Error Handling
app.use((err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
    const code = err.statusCode || 500; 
    const message = err.message || 'Internal Server Error'; 
    return res.status(code).json({ message: message });
});

//Listening to server
mongoose.connect(`${process.env.MONGODB_URL}`).then(() =>  app.listen(50053)).catch((err) => console.log(err))