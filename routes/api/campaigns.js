const express = require('express');
const router = express.Router();
const db = require('../../database');

// Function to format currency
function formatCurrency(amount) {
    return `Rp ${parseInt(amount).toLocaleString('id-ID')}`;
}

// GET /api/campaigns - Get campaigns for company profile
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || 6;
    const status = req.query.status || 'aktif';
    const baseUrl = req.query.base_url || `${req.protocol}://${req.get('host')}`;
    
    const query = `SELECT * FROM campaigns WHERE status = ? ORDER BY id DESC LIMIT ?`;
    
    db.all(query, [status, limit], (err, campaigns) => {
        if (err) {
            console.error('Error fetching campaigns:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data campaign'
            });
        }

        // Format the campaigns data according to API documentation
        const formattedCampaigns = campaigns.map(campaign => ({
            id: campaign.id,
            title: campaign.title,
            description: campaign.description || campaign.title,
            short_description: campaign.description ? 
                (campaign.description.length > 100 ? 
                    campaign.description.substring(0, 100) + '...' : 
                    campaign.description) : 
                campaign.title,
            category: campaign.category || 'Umum',
            location: campaign.location || 'Indonesia',
            target: campaign.goalAmount || 0,
            target_formatted: formatCurrency(campaign.goalAmount || 0),
            collected: campaign.amountCollected || 0,
            collected_formatted: formatCurrency(campaign.amountCollected || 0),
            image: campaign.imgSrc ? 
                (campaign.imgSrc.startsWith('http') ? campaign.imgSrc : `https://donasi.baitulmaalku.com/${campaign.imgSrc}`) : 
                null,
            status: campaign.status || 'aktif',
            donation_url: `https://donasi.baitulmaalku.com/campaigns/${campaign.id}/donate`,
            created_at: campaign.created_at || new Date().toISOString()
        }));

        res.json({
            success: true,
            data: {
                campaigns: formattedCampaigns,
                total: formattedCampaigns.length,
                website_info: {
                    name: "Donasi BaitulMaal Ku",
                    base_url: "https://donasi.baitulmaalku.com",
                    donation_base_url: "https://donasi.baitulmaalku.com/campaigns/"
                }
            }
        });
    });
});

// GET /api/campaigns/featured - Get featured campaigns for homepage
router.get('/featured', (req, res) => {
    const limit = parseInt(req.query.limit) || 3;
    const baseUrl = req.query.base_url || `${req.protocol}://${req.get('host')}`;
    
    // Get featured campaigns (you can add a 'featured' column to your database)
    // For now, let's get the most recent active campaigns
    const query = `SELECT * FROM campaigns WHERE status = 'aktif' ORDER BY id DESC LIMIT ?`;
    
    db.all(query, [limit], (err, campaigns) => {
        if (err) {
            console.error('Error fetching featured campaigns:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data campaign unggulan'
            });
        }

        // Format the campaigns data
        const featuredCampaigns = campaigns.map(campaign => ({
            id: campaign.id,
            title: campaign.title,
            description: campaign.description || campaign.title,
            short_description: campaign.description ? 
                (campaign.description.length > 150 ? 
                    campaign.description.substring(0, 150) + '...' : 
                    campaign.description) : 
                campaign.title,
            category: campaign.category || 'Umum',
            location: campaign.location || 'Indonesia',
            target: campaign.goalAmount || 0,
            target_formatted: formatCurrency(campaign.goalAmount || 0),
            collected: campaign.amountCollected || 0,
            collected_formatted: formatCurrency(campaign.amountCollected || 0),
            image: campaign.imgSrc ? 
                (campaign.imgSrc.startsWith('http') ? campaign.imgSrc : `https://donasi.baitulmaalku.com/${campaign.imgSrc}`) : 
                null,
            donation_url: `https://donasi.baitulmaalku.com/campaigns/${campaign.id}/donate`,
            cta_text: "Donasi Sekarang",
            created_at: campaign.created_at || new Date().toISOString()
        }));

        res.json({
            success: true,
            data: {
                featured_campaigns: featuredCampaigns,
                total: featuredCampaigns.length
            }
        });
    });
});

// GET /api/campaigns/:id - Get single campaign with payment methods
router.get('/:id', (req, res) => {
    const campaignId = req.params.id;
    const baseUrl = req.query.base_url || `${req.protocol}://${req.get('host')}`;
    
    const query = `SELECT * FROM campaigns WHERE id = ?`;
    
    db.get(query, [campaignId], (err, campaign) => {
        if (err) {
            console.error('Error fetching campaign:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data campaign'
            });
        }

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign tidak ditemukan'
            });
        }

        // Format the campaign data
        const formattedCampaign = {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description || campaign.title,
            category: campaign.category || 'Umum',
            location: campaign.location || 'Indonesia',
            target: campaign.goalAmount || 0,
            target_formatted: formatCurrency(campaign.goalAmount || 0),
            collected: campaign.amountCollected || 0,
            collected_formatted: formatCurrency(campaign.amountCollected || 0),
            image: campaign.imgSrc ? 
                (campaign.imgSrc.startsWith('http') ? campaign.imgSrc : `https://donasi.baitulmaalku.com/${campaign.imgSrc}`) : 
                null,
            status: campaign.status || 'aktif',
            created_at: campaign.created_at || new Date().toISOString()
        };

        // You can add payment methods here if you have them in your database
        const paymentMethods = {
            qris_list: [
                // Add your QRIS payment methods here
            ],
            bank_accounts: [
                // Add your bank account information here
            ]
        };

        res.json({
            success: true,
            data: {
                campaign: formattedCampaign,
                ...paymentMethods
            }
        });
    });
});

module.exports = router;
