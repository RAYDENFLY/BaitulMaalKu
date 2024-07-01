const express = require('express');
const router = express.Router();
const gotoController = require('../../controllers/goto/gotoControllers');

router.get('/', gotoController.getGotoPage);
router.get('/companyprofile', gotoController.getCompanyProfile);
router.get('/laporanpenyaluran', gotoController.getLaporanPenyaluran);
router.get('/proposalprogram', gotoController.getProposalProgram);
router.get('/rekening', gotoController.getRekeningDonasi);

module.exports = router;
