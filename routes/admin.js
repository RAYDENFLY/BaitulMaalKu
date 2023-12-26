const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminControllers');

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/dashboard', adminController.getDashboard);
router.get('/register', adminController.getRegister);
router.post('/register', adminController.postRegister);

module.exports = router;
