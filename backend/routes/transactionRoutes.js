const express = require('express');
const multer = require('multer');
const path = require('path');
const { buyTokens, withdrawTokens, getHistory, getPublicStats } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.post('/buy', protect, upload.single('proof'), buyTokens);
router.post('/withdraw', protect, withdrawTokens);
router.get('/history', protect, getHistory);
router.get('/stats', protect, getPublicStats);

module.exports = router;
