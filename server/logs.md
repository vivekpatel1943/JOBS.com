1. i have a signin and a signup route and i can also fetch the signed-in user , 
2. we also need to verify the user's email by sending them an OTP so we can confirm that the user is using their own email and not somebody else's, without having their email we can't allow the users to post or apply for gigs  , we can't let them even to sign-in if they don't have their email verified 
3. i want the app to ask the user for their aadhaar when they are applying for their first gig or when the user is posting a gig for the first time,

=> so the next thing we shall be doing is writing the routes for email verification and for aadhaar verification..

=> writing routes for aadhaar verification 
=> we would also like them to upload a very clear picture of their own , and we will need need their aadhaar a picture of their aadhaar or some verification technique by making them provide their digilocker or something and some api for criminal verification , 

the image shall be stored in the cloudinary so will be the images of aadhaar,

if they have not provided us with these three pieces of information along with email verification we shall not allow them to post their first gig or accept a gig offer and it's completely fine if they sign-in even without having their email verified it's just they can neither post any gigs or accept any gig offer,

=> this is what we shall be doing tomorrow
// now what you gotta do is take those images and parse it with multer save them in the cloudinary  

29th of october, 2025
1. set up cloudinary first , the images uploaded have to be saved in the cloudunary and the link to those images in the cloudinary have to be saved in the database,
2. 

now i can upload image to the cloudinary take the links to the images and save it in my database , now next think should be verify aadhaar and checking criminal backgrounds of the people which could be done later , now i shall focus on the core logic of the app which would be posting the jobs and applying  for them ,

so the first route will simply be a post route

postGigHandler => 
the person posting the gig should be verified , check it in the same handler
they will have to provide the title and description of the gig along with their address , and also the money they are offering , 

{
    "title" : "mow the lawn",
    "description":"mow my 200 sq ft. lawn",
    "address" : "200A Chandranagar, Bhilai",
    "offer":"Rs 200", //this is gonna be an optional field   
    "area":"local", //area could either be local or citywide or countrywide or worldwide ,
    "agreedPrice" : "Rs 300" //initially null , but once both of them agree at a price we save the value in this field 
    paid :  false //we will be saving booleans here initially if the price is paid this toggles to true and we send both parties an invoice , 
}

=> we can have a route file with the name gigs.route.ts , there will be a post-gig route , apply-for-gigs route ,   

=> okay so i can't relate multiple jobs to one User doing something like 

  jobs Job[]?  

30th of october , 2025
=> write the createJobs handler and route as well, 
=> write the applyForJobs handler and route as well
=> tomorrow create your first job , and also apply for one as well , 
=> i will have to write zod schema for this , 


applyForJobsHandler
=> when somebody is applying for the jobs ,
1. first thing he needs to do is to show his availability for the job , and put up an offer , if the employer agrees they can move on and close the deal , or they can move to the negotiation section which will basically be a chat interface, and present a counter price, when they agree they close the deal when both of them hit close the deal button the job moves to the processing status   

so in the applyForJobsHandler a user just needs to show his availability for a particular job that he receives the notification for ,  but do we need to save that in the database or we can use some other way like with redis pub/subs to just convey that information to the employer so that he can see all the users who are available to take that job , and we only save the agreedPrice when the deal has been closed , 

=> create the jobApplication model tomorrow , this will keep a record of all the jobs that a user is applying for 

model JobApplication {
  id         String   @id @default(uuid())
  jobId      String
  userId     String
  status     String   @default("pending") // pending, accepted, rejected
  createdAt  DateTime @default(now())

  job  Job  @relation(fields: [jobId], references: [id])
  user User @relation(fields: [userId], references: [id])
}
