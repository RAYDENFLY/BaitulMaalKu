const express = require('express');
const router = express.Router();

const aboutController = require('../controllers/aboutControllers');

router.get('/visimisi', aboutController.getVisiMisi);//Visi & Misi
router.get('/sejarah', aboutController.getSejarah)

module.exports = router