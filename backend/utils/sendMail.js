require("dotenv").config();
const nodemailer = require("nodemailer");

exports.sendmail = async () => {
  const transporter = await nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "morepranav51@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  return transporter;
};
