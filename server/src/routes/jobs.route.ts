import express from 'express';
import { applyForJobsHandler, createJobHandler,replyToApplicationsHandler } from "../controllers/jobs.controllers";
import userAuthMiddleware from '../middlewares/user.auth';

const jobsRouter = express.Router();

jobsRouter.post('/createJobs',userAuthMiddleware,createJobHandler);
jobsRouter.post('/apply',userAuthMiddleware,applyForJobsHandler);
jobsRouter.post('/reply',userAuthMiddleware,replyToApplicationsHandler)
export default jobsRouter;