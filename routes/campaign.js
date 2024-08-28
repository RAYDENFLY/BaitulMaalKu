const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignControllers');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Route to display dashboard with campaigns and logs
router.get('/dashboard', isAuthenticated, campaignController.showDashboard);

// Route to get all campaigns
router.get('/', isAuthenticated, campaignController.getAllCampaigns);

// Route to add a campaign
router.post('/add', isAuthenticated, campaignController.addCampaign);

// Route to edit a campaign
router.post('/edit', isAuthenticated, campaignController.editCampaign);

// Route to delete a campaign
router.post('/delete', isAuthenticated, campaignController.deleteCampaign);

// Route to confirm a donation
router.post('/updateCollected', isAuthenticated, campaignController.updateCollected);

// Route to reject a donation
router.post('/rejectDonation', isAuthenticated, campaignController.rejectDonation);

// Route to display CRM data
router.get('/datacrm', isAuthenticated, campaignController.getCRMData);

router.get('/datacrm/download', isAuthenticated, campaignController.downloadDonationsCSV);

// Rute untuk mengunduh Excel
router.get('/datacrm/download/excel', isAuthenticated, campaignController.downloadDonationsExcel);


module.exports = router;
