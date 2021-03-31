import dotenv from "dotenv";
const ejs = require("ejs");
import createError from "http-errors";
import path from "path";
dotenv.config();
const sgMail = require("@sendgrid/mail");
let key = `${process.env.SENDGRID_API_KEY}`
let from = `${process.env.FROM_EMAIL}`
sgMail.setApiKey(key);

export const Mail = async  (options: { mail: any; subject: any; variables: any; email: any; }) => {
  try {
    let { mail, subject, variables, email } = options;
    const data = await ejs.renderFile(path.join(__dirname, email), variables, {
      async: true,
    });
    const msg = {
      to: mail,
      from,
      subject: subject,
      html: data,
    };
    await sgMail.send(msg);
  } catch (error) {
    console.log("error", error);
    throw new createError.Conflict(`Request was succesfull, but an Error occured sending confirmation mail`);
  }
}