/// <reference types="express" />

import { Jwt, JwtPayload } from "jsonwebtoken";

export interface UserJwtPayload extends JwtPayload {
    userId :  string,
    email : string
} 

declare global {
    namespace Express {
        interface Request {
            user? : UserJwtPayload;
        }
    }
}