const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/dashboard', userController.getDashboard);
router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister);

module.exports = router;
