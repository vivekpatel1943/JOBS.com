import express from 'express';
import {prisma} from './utils/prisma'; 
import dotenv from 'dotenv';
import cors from 'cors';
// import passport from 'passport';
import userAuthRouter from './routes/user.auth';
import jobsRouter from './routes/jobs.route';
import cookieParser from 'cookie-parser';
import {redisClient} from './utils/redisClient';

// configure all the environment variables 
dotenv.config();

const app = express();

// middlewares
app.use(cors({
    origin:"http://localhost:5173", 
    credentials : true, //this allows cookies to be sent to the backend from the browser
}))

// makes json data available as javascript objects
app.use(express.json());
app.use('/api/v1',userAuthRouter);
app.use('/api/v1',jobsRouter);
// cookie-parser middleware is applied globally so that req.cookies will be populated for all incoming requests
app.use(cookieParser())

const database_connect = async () => {
    try{
        await prisma.$connect();
        console.log("connection to the database successfull...");
    }catch(err){
        console.error("database connection error",err);
    }
}


database_connect();

const redisConnect = async () => {
    try{
        await redisClient.connect();
        console.log("redis connection successfull..")
    }catch(err){
        console.log("redis Connection errors",err);
    }
}

redisConnect();

const port = 3005;

app.listen(port,() => {
    console.log(`your server is running on port ${port}..`)
})