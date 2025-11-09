import express, { Request, Response } from 'express';
import { createJobsSchema , applyForJobsSchema, replyToApplicationsSchema} from '../types/types';
import { prisma } from '../utils/prisma';

export const createJobHandler = async (req: Request, res: Response) => {
    try {
        const parsedPayload = createJobsSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            res.status(400).json({ msg: parsedPayload.error });
            return;
        }

        const { title, description, address,  timing , offer, currency, reach } = req.body;

        const employerId = req.user?.userId; 

        const job = await prisma.job.create({
            data: {
                title,
                description,
                address,
                timing ,
                offer,
                currency,
                reach,
                // employerId : employerId!, //even this would do 
                employer: {
                    connect: { id: employerId! }
                }
            }
        })

        res.status(201).json({ msg: "job successfully created...", job });
        return;

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "internal server error" });
        return;
    }
}

export const applyForJobsHandler = async (req: Request , res:Response) => {
    try{
        
        const parsedPayload = applyForJobsSchema.safeParse(req.body);

        if(!parsedPayload.success){
            res.status(400).json({msg:parsedPayload.error});
            return;
        }

        // with this details the worker/employer offers to close the deal if the other party accepts the offer the deal closes  , or they can negotiate a little more  
       const {jobId  , employerId , offerDetails} = parsedPayload.data;

       const workerId = req.user?.userId as string;
        //verify if both accepted through some shared state or signature 
      /*   const isAgreed = await checkIfBothAccepted(jobId,workerId,employerId);
        
        if(!isAgreed){
            res.status(500).json({msg:"negotiation not finalized yet"});
        } */

        if(workerId === employerId){
            res.status(400).json({msg:"you can't apply to the jobs posted by yourself.."});
            return;
        }

        const jobApplication = await prisma.jobApplication.create({
            data : {
                jobId,
                workerId,
                employerId,
                offerDetails
            }
        })

        res.status(201).json({msg: "applied for the job",jobApplication});
        return;
    }catch(err){
        res.status(500).json({msg:"internal server error..."});
        return;
    }
}

export const replyToApplicationsHandler = async (req:Request,res:Response) => {
    try{
        const parsedPayload = replyToApplicationsSchema.safeParse(req.body);

        if(!parsedPayload.success){
            res.status(400).json({msg:parsedPayload.error});
            return;
        }

        const {jobId , workerId,  accepted , rejected} = parsedPayload.data;

        let jobApplication;

        if(accepted){
            jobApplication = await prisma.jobApplication.update({
                where : {
                    id : jobId
                },
                data : {
                    status : "accepted",
                }
            })

            await prisma.job.update({
                where : {
                    id : jobId
                },
                data : {
                    status : "in_progress",
                    workerId : workerId 
                }
            })
        }else if(rejected){
            jobApplication =  await prisma.jobApplication.update({
                where : {
                    id : jobId
                },
                data : {
                   status : "rejected"
                }
            })
        }

        res.status(200).json({msg:`job application successfully ${accepted && "accepted" || rejected && "rejected"},${jobApplication}` });

        return;

    }catch(err){
        res.status(500).json({msg:"internal server error..."});
        return;
    }
} 