import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

//refered to https://nodemailer.com/about/
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.pwd
  }
});

const options = {
  from: "SendIT",
  to: "jean.abayo@gmail.com",
  subject: "Test",
  html: `
          <p>Dear
            HTML will be here!
          </p>
          `
};

export const sendEmail = params => {
  return new Promise((resolve, reject) => {
    transporter
      .sendMail(options)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};
