const nodemailer = require('nodemailer');
const validator = require('validator');
const axios = require('axios');

// Konfigurasi transporter Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'baitulmaalku@gmail.com',
    pass: 'mujd cgey txnw cnjw',
  },
});

// Konfigurasi reCAPTCHA
const RECAPTCHA_SECRET_KEY = '6Lf17SIqAAAAAO2K4ELlFmR3dYYCOdCLbb2znb5P'; // Ganti dengan kunci rahasia reCAPTCHA Anda

// Fungsi untuk mengirim email
async function sendEmail(req, res) {
  const { name, email, subject, message, recaptchaToken } = req.body;

  // Validasi input
  if (!validator.isEmail(email)) {
    return res.status(400).send('Invalid email address');
  }
  if (!validator.isLength(message, { min: 1, max: 500 })) {
    return res.status(400).send('Message is too short or too long');
  }

  // Verifikasi reCAPTCHA
  try {
    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!recaptchaResponse.data.success) {
      return res.status(400).send('reCAPTCHA verification failed');
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).send('Internal Server Error');
  }

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
      console.error('Email sending error:', error);
      return res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent: ' + info.response);
      return res.send('Your message has been sent. Thank you!');
    }
  });
}

module.exports = { sendEmail };
