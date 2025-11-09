import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// configuring environment variables 
dotenv.config();

export const sendMail = async(to:string,subject:string,html?:string) => {
    //create transporter
    const transporter = nodemailer.createTransport({
        service : "gmail", //or use "host","port" or your custom SMTP 
        auth : {
            user : process.env.email_user,
            pass : process.env.email_pass
        }
    })

    //send mail
    const info =  await transporter.sendMail({
        from : `jobs.com <${process.env.email_user}>`,
        to,
        subject,
        html
    })

    console.log(`message sent to , ${info.messageId}`);
}
