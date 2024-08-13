const nodemailer = require('nodemailer');
const multer = require('multer');
const express = require('express')
const app = express();
// Konfigurasi multer untuk menangani unggahan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Menyimpan file di folder 'uploads'
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Menyimpan dengan nama file asli
    }
});

const upload = multer({ storage: storage });

// Endpoint untuk menangani email donasi dengan unggahan file
app.post('/send-donation-email', upload.single('paymentProof'), sendDonationEmail);

function sendDonationEmail(req, res) {
    
    const {
        fullName,
        phoneNumber,
        emailContact,
        nominal,
        qty,
        atasNama,
        selectedProgram,
        donationAmount,
        paymentMethod,
        cardOwnerName,
        cardNumber,
        paymentProof,
        // tambahkan atribut formulir lainnya sesuai kebutuhan
    } = req.body;

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
        from: 'baitulmaalku@gmail.com',
        to: 'baitulmaalku@gmail.com',
        subject: 'Konfirmasi Donasi',
        text: `
            Nama Lengkap: ${fullName}
            Nomor Telepon: ${phoneNumber}
            Email: ${emailContact}

            Data Donasi:
            Nominal: ${nominal}
            QTY: ${qty}
            Atas Nama: ${atasNama}
            Program: ${selectedProgram}
            Jumlah Donasi: ${donationAmount}
            Metode Pembayaran: ${paymentMethod}
            Nama Pemilik Kartu: ${cardOwnerName}
            Nomor Kartu: ${cardNumber}
        `
    };

    // Kirim email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Your donation confirmation has been sent. Thank you!');
        }
    });
}

module.exports = { sendDonationEmail };
