import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
import { prisma } from '../utils/prisma';
import { userSignupSchema, userSigninSchema, userVerifyEmailSchema, verifyOTPForEmailVerificationSchema } from '../types/types';
import jwt, { SignOptions } from 'jsonwebtoken';
import { redisClient } from '../utils/redisClient';
import { sendMail } from '../utils/emailClient';


// configuring environment variables
dotenv.config();

// initialise express
const app = express();

export const userSignup = async (req: Request, res: Response): Promise<void> => {
    try {

        const parsedPayload = userSignupSchema.safeParse(req.body);

        // console.log("parsedPayloadData", parsedPayload)

        if (!parsedPayload.success) {
            const payloadError = parsedPayload.error;
            return res.status(400).json({ msg: "invalid input..", payloadError }) as unknown as void;
        }

        const { email, password } = parsedPayload.data;

        // here the number 10 is the number of salt rounds which refer to the number of recursive hashing that the password will go through to create the hashed password 
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            },
            select: {
                email: true,
            }
        })

        res.status(201).json({ msg: "user account has been successfully created", user });

        return;

    } catch (err) {
        res.status(500).json({ msg: "internal server error..", err })
        return;
    }
}

export const sendOTPForEmailVerification = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedPayload = userVerifyEmailSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            res.status(400).json({ msg: parsedPayload.error });
            return;
        }

        const { email } = parsedPayload.data;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            res.status(404).json({ msg: "user with the given email doesn't exist.." });
            return;
        }

        // generating a random OTP 
        const emailVerificationOTP = Math.floor(Math.random() * 900000) + 100000

        // setting up the OTP in the redis instance
        // syntax to set redis values redisClient.set(key,value,expirydate);
        redisClient.set(`emailVerificationOTP:${email}`, emailVerificationOTP, { EX: 300 }); //5 mins or 300 seconds will be the ttl or time-to-live of the otp , then it will get deleted all by itself 

        sendMail(
            email,
            "<jobs.com> , email verfication message",
            `
                <div>
                    <h1><b>${emailVerificationOTP}</b></h1>
                    <p>OTP(one-time-password) to verify your email is <b>${emailVerificationOTP}</b>, if you didn't make any request for this please ignore the message..</p>
                </div>
            `
        )

        res.status(200).json({ msg: "message sent to the user's gmail successfully.." });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "internal server error" });
        return;
    }
}

export const verifyEmailVerificationOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedPayload = verifyOTPForEmailVerificationSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            res.status(400).json({ error: parsedPayload.error });
            return;
        }

        const { emailVerificationOTP, email } = parsedPayload.data;

        const storedOtp = await redisClient.get(`emailVerificationOTP:${email}`);

        if (!storedOtp) {
            res.status(500).json({ msg: "internal server error..." });
            return;
        }

        if (storedOtp !== emailVerificationOTP) {
            // check the ttl(time to live , time left before the key along with it's value expires) for the redis key 
            const timeLeft = await redisClient.ttl(`emailVerificationOTP:${email}`);
            console.log("time left", timeLeft);
            res.status(400).json({ msg: `OTP doesn't match , you can generate another one in ${timeLeft} seconds....` })
            return;
        }

        res.status(200).json({ msg: "otp verified successfully..." });


        // verify the user's email
        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                isEmailVerified: true
            }
        })

        // delete the OTP after use
        await redisClient.del(`emailVerficationOTP:${email}`);

        return;

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "internal server error", err });
        return;
    }
}

export const userSignin = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedPayload = userSigninSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            return res.status(400).json({ msg: "invalid input..." }) as unknown as void;
        }

        const { email, password } = parsedPayload.data;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            res.status(404).json({ msg: "user with the given email not found..." });
            return;
        }

        // bcrypt.compare is asynchronous function without await it is always truthy,
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({ msg: "incorrect password.." })
            return;
        }

        // function to sign the token 
        // SignOptions is a special type imported from the jsonwebtoken module itself for optional settings like expiresIn, algorithm to sign the token 

        const signToken = (payload: string | object | Buffer, secret: string, options: SignOptions): Promise<string> => {
            return new Promise((resolve, reject) => {
                jwt.sign(payload, secret, options ?? {}, (err, token) => {
                    if (err || !token) return reject(err);
                    resolve(token);
                })
            })
        }

        const token = await signToken({ userId: user.id, email: user.email }, process.env.jwt_secret as string, { expiresIn: "1w" });

        res.cookie('token', token, {
            httpOnly: true, //prevents javascript access to cookies , helps avoid XSS(cross-site scripting)
            secure: process.env.NODE_ENV === 'production', //while in development this stays false 
            // while in production secure : true and this makes sure that cookie is only sent over https in production
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
            //while in production sameSite will be none and the requests from all other sites shall be allowed while in development sameSite will be lax which provides a good balance between security and usability, for sameSite to be none or to allow all cross site requests secure should be true as well
            maxAge: 7 * 24 * 60 * 60 * 1000 // maxAge , a week in milliseconds
        }).json({ msg: "logged-in successfully..", token })

        return;
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "internal server error.." })
        return;
    }
}

export const userProfile = async (req: Request, res: Response): Promise<void> => {
    try {

        // Check if user exists in request (added by middleware)
        if (!(req.user as any).userId) {
            res.status(401).json({ msg: "unauthorized - user not authenticated" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                id: (req.user as any).userId
            },
            select: {
                id: true,
                email: true,
                isEmailVerified: true,
                userImages: true,
                /* employerJobs:true,
                workerJobs : true, */
            }
        });

        console.log("user", user);

        res.status(200).json({ msg: "user", user });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "internal server error..." });
    }
}

export const userJobApplications = async (req: Request, res: Response): Promise<void> => {
    try {

        if (!(req.user as any).userId) {
            res.status(401).json({ msg: "unauthorized: user not authenticated..." });
            return;
        }

        const userApplications = await prisma.user.findUnique({
            where: {
                id: (req.user as any).userId
            },
            select: {
                jobApplications : {
                    include: {
                        job : true
                    }

                }
            }
        })

        res.status(200).json({msg:"all the jobs user has applied to has been fetched", userApplications});
        return;

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "internal server error" });
        return;
    }
}


export const userJobPosts = async (req: Request, res: Response): Promise<void> => {
    try {

        if (!(req.user as any).userId) {
            res.status(401).json({ msg: "unauthorized: user not authenticated..." });
            return;
        }

        const userJobPosts = await prisma.user.findUnique({
            where: {
                id: (req.user as any).userId
            },
            select: {
                employerJobs: {
                    include: {
                        applications: true
                    }
                }
            }
        })

        res.status(200).json({ msg: "all the job posts made by the user has been successfully fetched..", userJobPosts });
        return;

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "internal server error" });
        return;
    }
}


export const uploadImageHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            res.status(400).json({ msg: `invalid request, user with the id ${userId} does not exist` })
            return;
        }

        // multer adds file info to req.file
        const file = req.file as Express.Multer.File;

        if (!file) {
            res.status(404).json({ msg: "no file uploaded..." });
            return;
        }

        const image = await prisma.userImage.create({
            data: {
                imageURL: (file as any).path, //cloudinary link
                user: {
                    connect: { id: userId }
                }
            }
        })

        res.status(201).json({ msg: "cloudinary imageURL saved in the database...", image });
        return;
    } catch (err) {
        console.log("error", err);
        res.status(500).json({ msg: "internal server error..." });
        return;
    }
}



