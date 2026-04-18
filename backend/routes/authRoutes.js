const express = require('express');
const { 
    register, 
    login, 
    getMe, 
    verifyOTP, 
    resendOTP,
    toggle2FA,
    verify2FA,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/verify-2fa', verify2FA);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.get('/me', protect, getMe);
router.put('/toggle-2fa', protect, toggle2FA);
router.put('/update-password', protect, updatePassword);

module.exports = router;
