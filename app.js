const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const midtransClient = require('midtrans-client');
const multer = require('multer');
const http = require('http');

// Initialize dotenv for environment variables
dotenv.config();

const app = express(); // Initialize the app here

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Set views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Midtrans Snap API
let snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Konfigurasi penyimpanan file dengan Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');  // Folder tujuan penyimpanan file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Nama file dengan timestamp untuk menghindari duplikasi
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Batas ukuran file (opsional, di sini 5MB)
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;  // Tipe file yang diizinkan
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// Import Routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const layananRoutes = require('./routes/layanan');
const tataKelolaRoutes = require('./routes/tatakelola');
const aboutRoutes = require('./routes/about');
const contactController = require('./controllers/contactControllers');
const donationController = require('./controllers/donationControllers');
const zisPaymentRoutes = require('./routes/gate/payment/zisPayment');
const zisControllers = require('./controllers/gate/zisControllers');
const gotoRoutes = require('./routes/goto/go');
const campaignRoutes = require('./routes/campaign');
const authRoutes = require('./routes/auth');
const qrisRoutes = require('./routes/qris');
const campaignController = require('./controllers/campaignControllers');

// Import API Routes
const apiCampaignsRoutes = require('./routes/api/campaigns');

// Middleware Authentication
const { isAuthenticated } = require('./middlewares/authMiddleware');

// Use Routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/layanan', layananRoutes);
app.use('/tatakelola', tataKelolaRoutes);
app.use('/about', aboutRoutes);
app.use('/go', gotoRoutes);
app.use('/auth', authRoutes);
app.use('/qris', qrisRoutes);

// API Routes
app.use('/api/campaigns', apiCampaignsRoutes);

// Apply Authentication Middleware to Campaign Routes
app.use('/campaigns', campaignRoutes);

// Handle form submissions
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.post('/send-email', emailLimiter, contactController.sendEmail);
app.post('/send-donation-email', donationController.sendDonationEmail);

app.use('/gate/payment', zisPaymentRoutes);
app.post('/gate/payment/proses_pembayaran_zakat', zisControllers.postPayment);

// 404 Error Handler
app.use((req, res) => {
    res.status(404).render('404', { message: 'Page Not Found' });
});

// Create HTTP server and WebSocket
const server = http.createServer(app);

// WebSocket middleware
const wss = require('./middlewares/webSocket');

// Attach WebSocket to the HTTP server
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, request);
    });
});



// Server Listening
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
