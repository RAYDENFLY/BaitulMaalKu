const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignControllers');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Rute tanpa autentikasi
router.get('/:id/donate', campaignController.showDonationForm);
router.post('/:id/donate', campaignController.submitDonation);

// Rute dengan autentikasi
router.use(isAuthenticated); // Terapkan middleware hanya untuk rute di bawah ini

router.get('/dashboard', campaignController.showDashboard);
router.get('/', campaignController.getAllCampaigns);
router.post('/add', campaignController.addCampaign);
router.post('/edit', campaignController.editCampaign);
router.post('/delete', campaignController.deleteCampaign);
router.post('/updateCollected', campaignController.updateCollected);
router.post('/rejectDonation', campaignController.rejectDonation);
router.get('/datacrm', campaignController.getCRMData);
router.get('/datacrm/download', campaignController.downloadDonationsCSV);
router.get('/datacrm/download/excel', campaignController.downloadDonationsExcel);
router.get('/download-database', campaignController.downloadDatabase);
router.post('/deleteDonation', campaignController.deleteDonation);

module.exports = router;
