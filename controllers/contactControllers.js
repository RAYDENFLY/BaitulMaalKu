const nodemailer = require('nodemailer');
const express = require('express')
app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function sendEmail(req, res) {
    console.log(req.body); 
    const { name, email, subject, message } = req.body;

  // Konfigurasi transporter untuk nodemailer (sesuaikan dengan email Anda)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'baitulmaalku@gmail.com',
      pass: 'mujd cgey txnw cnjw',
    },
  });

  // Konfigurasi email
  const mailOptions = {
    from: 'support.baitulmaalku.com',
    to: 'baitulmaalku@gmail.com',
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Kirim email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Your message has been sent. Thank you!');
    }
  });
}

module.exports = { sendEmail };
