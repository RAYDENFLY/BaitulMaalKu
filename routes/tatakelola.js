const express = require('express');
const router = express.Router();

const tataKelolaController = require('../controllers/tatakelolaControllers');

router.get('/legalFormat', tataKelolaController.getTataKelola); //konfirmasi donasi

module.exports = router;