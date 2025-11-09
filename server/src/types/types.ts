import zod from 'zod';

export const userSignupSchema = zod.object({
    email: zod.string().email("Invalid email format.."),
    password: zod.string()
        .min(8, "password must be atleast 8 characters long.")
        .regex(/[A-Z]/, "Password  must contain atleast one uppercase letter.")
        .regex(/[a-z]/, "password must contain atleast one lowercase letter")
        .regex(/[0-9]/, "password must contain atleast one digit")
        .regex(/[\W\s]/, "Password must contain atleast one special character.")
})

export const userSigninSchema = zod.object({
    email : zod.string(),
    password : zod.string()
})

export const userVerifyEmailSchema = zod.object({
    email : zod.string().email("Invalid email format..")
});

export const verifyOTPForEmailVerificationSchema = zod.object({
    emailVerificationOTP : zod.string(),
    email : zod.string().email("Invalid email format..")
})

export const createJobsSchema = zod.object({
    title : zod.string(),   
    description : zod.string(),
    address : zod.string(),
    latitude : zod.number().optional(),
    longitude : zod.number().optional(),
    offer : zod.number().optional(),
    agreedPrice : zod.number().optional(),
    currency : zod.enum(["INR","USD","EURO"]).optional(),
    status : zod.string().optional().default('open'), //.enum(["open","in_progress","completed","cancelled"])
    reach : zod.enum(["local","citywide","countrywide","worldwide"]),
    paid : zod.boolean().default(false),
    platformFee : zod.number().optional(),
    workerRating : zod.number().optional(), //rated by the employer
    employerRating : zod.number().optional(), //rated by the worker
    invoiceUrl : zod.string().optional(), //link to wherever you have stored the invoice 
    workerId : zod.string().optional()
})


export const applyForJobsSchema = zod.object({
    jobId : zod.string(),
    employerId : zod.string(),
    offerDetails : zod.string()
}) 

export const replyToApplicationsSchema = zod.object({
    jobId : zod.string(),
    workerId : zod.string(), 
    pending : zod.boolean().default(true),
    accepted : zod.boolean().default(false),
    rejected : zod.boolean().default(false)
})