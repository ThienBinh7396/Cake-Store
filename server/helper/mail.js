const nodemailer = require("nodemailer");

require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

const sendMail = ({ to, subject, html } = {}) => {

  let mailOptions = { to, subject, html }

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
const asyncSendMail = async ({ from, to, subject, html } = {}) => {
  let mailOptions = {
    from: "thienbinh30091989@gmail.com",
    to: "binhhvd00682@fpt.edu.vn",
    subject: "Sending Email using Node.js",
    html
  };

  return new Promise(res => {
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        res(null);
      } else {
        console.log("Email sent: ",  info);
        res(info);
      }
    });
  });
};

module.exports = {
  sendMail,
  asyncSendMail
};
