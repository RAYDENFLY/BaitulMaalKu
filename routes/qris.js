const express = require('express');
const router = express.Router();

const qrisController = require('../controllers/qrisControllers');

router.get('/', qrisController.getQris);

module.exports = router;
