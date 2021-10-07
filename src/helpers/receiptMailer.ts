import dotenv from 'dotenv';
const ejs = require('ejs');
import createError from 'http-errors';
import path from 'path';
import fs from 'fs'

dotenv.config();
const sgMail = require('@sendgrid/mail');
let key = `${process.env.SENDGRID_API_KEY}`;
let from = `${process.env.SENDGRID_USERNAME}`;


sgMail.setApiKey(key);


export const ReceiptMail = async (options: { mail: string; subject: string; variables: any; email: string, attachment: string }) => {  
  try {
    let { mail, subject, variables, email, attachment } = options;
    
    // add the email message with this
    const data = await ejs.renderFile(path.join(__dirname, email), variables, {
      async: true,
    });
    
    const pathToAttachment =  `${__dirname}/../email/transaction-receipt/${attachment}.pdf`;    
    // const pathToAttachment =  `${__dirname}/../files/transaction-receipt/${attachment}.pdf`;    

    const fileAttachment = fs.readFileSync(pathToAttachment).toString("base64");
    

    const msg = {
        to: mail,
        // to: mail,
        from: from,
        subject,
        html: data,
        attachments: [
          {
            content: fileAttachment,
            filename: `${attachment}_receipt.pdf`,
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      };
      
    await sgMail.send(msg);
  } catch (error) {
    console.log('error', error);    
    throw new createError.Conflict(
      `No mail sent, try later!`
    );
  }
};
