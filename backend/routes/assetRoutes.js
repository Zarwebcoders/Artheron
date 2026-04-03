const express = require('express');
const { stakeTokens, claimEarnings, sosExit } = require('../controllers/assetController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/stake', protect, stakeTokens);
router.post('/claim', protect, claimEarnings);
router.post('/sos', protect, sosExit);

module.exports = router;
