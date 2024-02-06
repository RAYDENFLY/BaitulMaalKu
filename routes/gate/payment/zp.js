const express = require('express');
const router = express.Router();
const zisController = require('../../../controllers/gate/zisControllers');

router.get('/zakat', zisController.getPaymentZakat);

// Rute pemrosesan formulir zakat
router.post('/proses_pembayaran_zakat', async (req, res) => {
    try {
        const midtrans = req.app.locals.midtrans;

        const nominal = req.body.nominal;
        const nama = req.body.nama;
        const anonim = req.body.anonim ? 'Anonim' : 'Tidak Anonim';
        const wa = req.body.wa;
        const email = req.body.email;
        const doa = req.body.doa;
        const metodePembayaran = req.body.metode_pembayaran;

        // Persiapkan data untuk request pembayaran
        const transactionDetails = {
            orderId: 'ORDER_ID', // Gantilah dengan ID pesanan unik Anda
            grossAmount: nominal,
        };

        const paymentResponse = await midtrans.charge({
            payment_type: 'bank_transfer',
            transaction_details: transactionDetails,
        });

        // Redirect ke halaman pembayaran Midtrans
        res.redirect(paymentResponse.redirect_url);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat pemrosesan pembayaran.');
    }
});

router.get('/infaq', zisController.getPaymentInfaq);

module.exports = router;
