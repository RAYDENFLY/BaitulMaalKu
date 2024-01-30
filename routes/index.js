const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexControllers');

router.get('/', indexController.getIndex);
router.get('/dokumentasi', indexController.getDokumentasi);
router.get('/mitra-kami', indexController.getMitraKami);
router.get('/tataKelola', indexController.getTataKelola);


module.exports = router;
