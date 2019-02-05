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
  subject: "SendIT- Parcel Updtes"
};

export const sendEmail = parcel => {
  const objectKeys = Object.keys(parcel.details);
  const message = `
  Dear ${parcel.first_name},
  
  <p>This is SendIT Team, there have been some update on your recent parcel with the following details: <br>
  <b>Destination:</b> ${parcel.destination}, ${
    parcel.address.destination_address
      ? parcel.address.destination_address
      : "-"
  }<br>
  <b>PickUp Location:</b> ${parcel.pickup_location}, ${
    parcel.address.pickup_address ? parcel.address.pickup_address : "-"
  }<br>
  <u><b>Details</b></u>:<br>
  <small>
    <b>Weigth</b>: ${parcel.details.weight ? parcel.details.weight + "g" : "-"}
    <b>Height</b>: ${parcel.details.height ? parcel.details.height + "cm" : "-"}
    <b>Width</b>: ${parcel.details.width ? parcel.details.width + "cm" : "-"}
    <b>Quantity</b>: ${parcel.details.quantity ? parcel.details.quantity : "-"}
  </small>
  <br>
  <b>Current Location:</b> ${parcel.current_location}<br>
  <b>Status</b>: ${parcel.status}<br>
  <br>
  Thank you for choosing us!<br>
  Best,
  <br>
  <br>
  SendIT Team,<br>
  Email: hello@sendit.com<br>
  Phone: 250789277275<br>
  </p>
  `;
  return new Promise((resolve, reject) => {
    transporter
      .sendMail({
        ...options,
        to: parcel.email,
        html: message
      })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const resetPwdEmail = (user, link) => {
  const message = `
  Dear ${user.first_name},
  
  <p>This is SendIT Team, it seems you are recently requested for changing your SendIT account password.<br>
  If it was you, please follow this <a href=${link}>link</a> or copy past the the following link:
  <br>
  <br>
   ${link} 
  <br>
  <br>
  Please, ignore this email if you did not request for password change. <br>
  Thank you for choosing us!<br>
  Best,
  <br>
  <br>
  SendIT Team,<br>
  Email: hello@sendit.com<br>
  Phone: 250789277275<br>
  </p>
  `;
  return new Promise((resolve, reject) => {
    transporter
      .sendMail({
        ...options,
        subject: "Password Reset",
        to: user.email,
        html: message
      })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};
