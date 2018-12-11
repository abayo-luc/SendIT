import dotenv from "dotenv";
import mailgun from "mailgun-js";
dotenv.config();

const api_key = process.env.api_key;
const domain = process.env.domain;

const data = {
  from: "SendIt <me@samples.mailgun.org>",
  to: "luc.bayo@gmail.com",
  subject: "Hello",
  text: "Testing some Mailgun awesomeness!"
};

export const sendEmail = params => {
  return new Promise((resolve, reject) => {
    mailgun({ apiKey: api_key, domain: domain })
      .messages()
      .send(data, function(error, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
  });
};
