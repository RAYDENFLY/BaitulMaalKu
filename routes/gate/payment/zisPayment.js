const express = require('express');
const router = express.Router();
const midtransClient = require('midtrans-client');
const zisController = require('../../../controllers/gate/zisControllers');

// Replace with your actual server key
const serverKey = 'Mid-server-_Sklw5LDZ2-RPuhdQC0kazX-';
const clientKey = 'Mid-client-hz0wBC9Neu8vISps';
const base64ServerKey = Buffer.from(serverKey).toString('base64');

console.log('Original Server Key:', serverKey);
console.log('Base64 Server Key:', base64ServerKey);

// Create Midtrans Snap instance
const snap = new midtransClient.Snap({
    isProduction: true,
    serverKey: base64ServerKey,
    clientKey: clientKey,
});

// Function to generate a unique order ID
function generateUniqueOrderId() {
    return Math.floor(Math.random() * 1000000000);
}

// Function to create a Snap transaction
const createSnapTransaction = async (parameter) => {
    try {
        const transaction = await snap.createTransaction(parameter);
        const transactionToken = transaction.token;
        console.log('transactionToken:', transactionToken);
        return transactionToken;
    } catch (error) {
        console.error('Error creating Snap transaction:', error);

        if (error.ApiResponse) {
            console.error('API Response:', error.ApiResponse);
        }

        throw error;
    }
};


// Route for rendering zakat payment page
router.get('/zakat', zisController.getPaymentZakat);

// Route for processing zakat payment
router.post('/proses_pembayaran_zakat', async (req, res) => {
    try {
        const nominal = req.body.nominal;
        const nama = req.body.nama;
        const wa = req.body.wa;
        const email = req.body.email;

        // Prepare transaction details for Midtrans
        const transactionDetails = {
            order_id: generateUniqueOrderId(),
            gross_amount: nominal,
            items: [{
                name: 'Zakat Payment',
                price: nominal,
                quantity: 1,
            }],
            customer_details: {
                first_name: nama,
                email: email,
                phone: wa,
            },
        };

        // Create Midtrans transaction and obtain transaction token
        const transactionToken = await createSnapTransaction(transactionDetails);

        // Log the transaction token
        console.log('transactionToken:', transactionToken);

        // Redirect to Midtrans payment page
        res.redirect(transactionToken.redirect_url);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing payment.');
    }
});

router.get('/infaq', zisController.getPaymentInfaq);

module.exports = router;
