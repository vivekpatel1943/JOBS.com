import express from 'express';
import cookieParser from 'cookie-parser';
import upload from '../middlewares/uploadImages'
import { userSignup ,sendOTPForEmailVerification,verifyEmailVerificationOTP, userSignin, userProfile, uploadImageHandler, userJobPosts, userJobApplications} from '../controllers/auth.users.controller';
import userAuthMiddleware from '../middlewares/user.auth'; 

const userAuthRouter = express.Router();

// middlewares
userAuthRouter.use(cookieParser());

userAuthRouter.post('/auth/signup',userSignup);
userAuthRouter.post('/auth/sendEmailVerificationOTP',sendOTPForEmailVerification);
userAuthRouter.post('/auth/verifyEmailVerificationOTP',verifyEmailVerificationOTP)
userAuthRouter.post('/auth/signin',userSignin);
userAuthRouter.get('/user/profile',userAuthMiddleware,userProfile);
userAuthRouter.get('/user/jobPosts',userAuthMiddleware,userJobPosts);
userAuthRouter.get('/user/jobApplications',userAuthMiddleware,userJobApplications)
userAuthRouter.get('/user/profile',userAuthMiddleware,userProfile);
userAuthRouter.post('/uploadProfileImages/:userId',userAuthMiddleware,upload.single("image"),uploadImageHandler);

export default userAuthRouter;