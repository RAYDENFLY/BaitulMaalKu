const express = require('express');
const router = express.Router();

const layananController = require('../controllers/layananControllers');

router.get('/konfirmasiDonasi', layananController.getKonfirmasiDonasi); //konfirmasi donasi
router.get('/kantorPelayanan', layananController.getKantorLayanan) //Kantor Layanan

module.exports = router;