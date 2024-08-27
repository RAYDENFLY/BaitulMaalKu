const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignControllers');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Route to display dashboard
router.get('/dashboard', isAuthenticated, campaignController.showDashboard);

// Route to get all campaigns
router.get('/', isAuthenticated, campaignController.getAllCampaigns);

// Route to add a campaign
router.post('/add', isAuthenticated, campaignController.addCampaign);

// Route to edit a campaign
router.post('/edit', isAuthenticated, campaignController.editCampaign);

// Route to delete a campaign
router.post('/delete', isAuthenticated, campaignController.deleteCampaign);

module.exports = router;
