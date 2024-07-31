const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const midtransClient = require('midtrans-client');
const multer = require('multer');
const path = require('path');
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');
dotenv.config();

app.use(cors());

// Inisialisasi Snap API menggunakan kunci dari variabel lingkungan
let snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_PRODUCTION === 'true', // konversi nilai string menjadi boolean
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Set views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const layananRoutes = require('./routes/layanan');
const tataKelolaRoutes = require('./routes/tatakelola');
const aboutRoutes = require('./routes/about');
const contactController = require('./controllers/contactControllers');
const donationController = require('./controllers/donationControllers');
const zisPaymentRoutes = require('./routes/gate/payment/zisPayment');
const zisControllers = require("./controllers/gate/zisControllers")
const gotoRoutes = require('./routes/goto/go');

app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/layanan', layananRoutes);
app.use('/tatakelola', tataKelolaRoutes);
app.use('/about', aboutRoutes);

// Goto Use
app.use('/go', gotoRoutes);

// Handle form submission
app.post('/send-email', contactController.sendEmail);
app.post('/send-donation-email', donationController.sendDonationEmail);

app.use('/gate/payment', zisPaymentRoutes);
app.post('/gate/payment/proses_pembayaran_zakat', zisControllers.postPayment);

app.use((req, res) => {
    res.status(404).render('404', { message: 'Page Not Found' });
});

// Server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
