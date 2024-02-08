const express = require('express');
const router = express.Router();
const midtransClient = require('midtrans-client');
const zisController = require('../../../controllers/gate/zisControllers');

router.get('/infaq', zisController.getPaymentInfaq);
router.get('/zakat', zisController.getPaymentZakat);
router.get('/invoice', zisController.getPaymentInvoice)
router.get('/download-invoice-pdf', zisController.generateInvoicePDF);

module.exports = router;
