const nodemailer = require("nodemailer");

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  family: 4, // Force IPv4 to avoid timeouts on DigitalOcean
});

transporter.verify().then(() => {
  console.log("Ready for send emails");
});

module.exports = transporter;
