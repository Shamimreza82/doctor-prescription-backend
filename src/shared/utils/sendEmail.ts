import nodemailer from 'nodemailer';

import { envConfig } from '@/config/env.config';


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: envConfig.nodeMailerEmail,
    pass: envConfig.nodeMailerPass,
  },
});


const sendEmail = async (toEmail: string, emailSubject: string, bodyText: string,
  // html: string,


) => {
  const info = await transporter.sendMail({
    from: envConfig.nodeMailerEmail, // sender address
    to: toEmail, // list of receivers
    subject: emailSubject, // Subject line
    text: bodyText, // plain text body
    html: bodyText, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

export default sendEmail;