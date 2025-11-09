import express , {Request , Response , NextFunction} from 'express';
import dotenv from 'dotenv';
import jwt , {JwtPayload} from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import { UserJwtPayload } from '../types/express';

// initialising cookieParser
const app =  express();

// middlewares
//this middleware makes json data available as javascript object
app.use(express.json());
// middleware for parsing cookies 
app.use(cookieParser());

// when the user signs in we send them a token , this token has to be sent by the client to the server everytime he makes a request, the server verifies the identity of the client using the token 
const userAuthMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    // it is going to be stored in the cookies in the browser
    const token = req.cookies.token;

    console.log("token",token);

    if(!token){
        return res.status(400).json({msg:"token not provided..."});
    }

    try{

        // jwt.verify() function helps us to verify that the token being sent has not been tampered with or hasn't been expired
        const verifyJwt = async (token:string,secret:string) : Promise<UserJwtPayload>  => {
            return new Promise((resolve,reject) => {
                jwt.verify(token,secret,(err,data) => {
                    if(err) return reject(err);
                    resolve(data as UserJwtPayload);
                })
            })
        } 

        const isVerified = await verifyJwt(token,process.env.jwt_secret! as string);

        console.log("verified user data", isVerified);

        if(!isVerified){
            return res.status(400).json("invalid token..")
        }

        req.user = isVerified;

        next();

    }catch(err){
        console.error(err);
    }
}

export default userAuthMiddleware;