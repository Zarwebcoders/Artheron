const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ success: false, message: 'User already exists and is verified' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        let isNewUser = false;

        if (user) {
            // Update existing unverified user
            user.name = name;
            user.password = password;
            user.plainPassword = password;
            user.otp = otp;
            user.otpExpire = otpExpire;
        } else {
            // Create user
            isNewUser = true;

            // Generate sequential account number
            const lastUser = await User.findOne().sort({ accountNumber: -1 });
            const nextAccountNumber = lastUser && lastUser.accountNumber ? lastUser.accountNumber + 1 : 100001;

            user = new User({
                name,
                email,
                password,
                plainPassword: password,
                otp,
                otpExpire,
                accountNumber: nextAccountNumber
            });
        }

        await user.save();

        // Send OTP via Email
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #7b3fe4; text-align: center;">Artheron Protocol</h2>
                <p>Welcome to Artheron, <strong>${name}</strong>!</p>
                <p>Your account has been initialized. Here are your login credentials:</p>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #eee;">
                    <p style="margin: 5px 0;"><strong>Account Number:</strong> ${user.accountNumber}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                </div>

                <p>To secure your account and proceed to the dashboard, please use the 6-digit verification code below:</p>
                <div style="background: #7b3fe4; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; color: white; border-radius: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                
                <p style="font-size: 12px; color: #777; text-align: center;">This code will expire in 10 minutes. Please keep your credentials safe and do not share them with anyone.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 11px; color: #999; text-align: center;">This is an automated system message. Please do not reply.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Artheron Account Verification',
                html
            });

            res.status(200).json({ 
                success: true, 
                message: 'OTP sent to email. Please verify to continue.' 
            });
        } catch (mailErr) {
            console.error("Email Error:", mailErr);
            // If it's a new user and email fails, delete the record to keep DB clean
            if (isNewUser) {
                await User.findByIdAndDelete(user._id);
            }
            res.status(500).json({ success: false, message: 'Email could not be sent' });
        }

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }

        // Check OTP
        if (user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Verify and Clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        await sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.isVerified) {
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const html = `<div style="text-align:center;"><h2>Artheron Verify</h2><p>Your new OTP is: <strong>${otp}</strong></p></div>`;
        await sendEmail({ email: user.email, subject: 'New Verification Code', html });

        res.status(200).json({ success: true, message: 'OTP resent to email' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    const { accountNumber, password } = req.body;

    // Validate account number & password
    if (!accountNumber || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an account number and password' });
    }

    try {
        // Check for user
        const user = await User.findOne({ accountNumber: parseInt(accountNumber) }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials. Please use your numeric Account Number.' });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: 'Please verify your account first' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // --- 2FA Check ---
        if (user.is2FAEnabled) {
            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins
            await user.save();

            // Send OTP
            try {
                await sendEmail({
                    email: user.email,
                    subject: '🔒 2FA Verification Code - Artheron',
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #7b3fe4; border-radius: 10px;">
                            <h2 style="color: #7b3fe4;">Security Verification</h2>
                            <p>To finalize your login, please enter the following 6-digit code:</p>
                            <div style="background: #7b3fe4; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px;">
                                ${otp}
                            </div>
                            <p style="font-size: 11px; color: #777; margin-top: 20px;">If you didn't request this, please change your password immediately.</p>
                        </div>
                    `
                });

                return res.status(200).json({ 
                    success: true, 
                    require2FA: true, 
                    email: user.email,
                    message: '2FA code sent to your registered email'
                });
            } catch (err) {
                return res.status(500).json({ success: false, message: 'Could not send 2FA email' });
            }
        }

        await sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    // Calculate total yield cumulative
    const yieldData = await Transaction.aggregate([
        { $match: { user: user._id, type: 'yield', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalYield = yieldData.length > 0 ? yieldData[0].total : 0;

    res.status(200).json({
        success: true,
        data: {
            ...user.toObject(),
            totalYield
        }
    });
};

// @desc    Verify 2FA OTP
// @route   POST /api/auth/verify-2fa
// @access  Public
exports.verify2FA = async (req, res) => {
    const { accountNumber, otp } = req.body;

    try {
        const user = await User.findOne({ accountNumber: parseInt(accountNumber) }).select('+password');
        
        if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(401).json({ success: false, message: 'Invalid or expired 2FA code' });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        await sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Toggle 2FA
// @route   PUT /api/auth/toggle-2fa
// @access  Private
exports.toggle2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.is2FAEnabled = !user.is2FAEnabled;
        await user.save();

        res.status(200).json({
            success: true,
            is2FAEnabled: user.is2FAEnabled,
            message: `2FA ${user.is2FAEnabled ? 'Enabled' : 'Disabled'}`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found with that email' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save();

        // Create reset url
        // In local dev, normally we'd use localhost, but let's assume the frontend will handle this
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Artheron Password Reset',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #7b3fe4; border-radius: 10px;">
                        <h2 style="color: #7b3fe4;">Password Reset Request</h2>
                        <p>You requested a password reset. Please click the button below to set a new password:</p>
                        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #7b3fe4; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                        <p style="margin-top:20px;">If this link doesn't work, copy and paste this into your browser:</p>
                        <p>${resetUrl}</p>
                        <p style="font-size: 11px; color: #777;">This link expires in 30 minutes.</p>
                    </div>
                `
            });

            res.status(200).json({ success: true, message: 'Password recovery link sent to email' });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        // Set new password
        user.password = req.body.password;
        user.plainPassword = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        await sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update Password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }

    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Existing password is incorrect' });
        }

        // Set new password
        user.password = newPassword;
        user.plainPassword = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    // Calculate total yield cumulative
    const yieldData = await Transaction.aggregate([
        { $match: { user: user._id, type: 'yield', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalYield = yieldData.length > 0 ? yieldData[0].total : 0;

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            balances: user.balances,
            kycStatus: user.kycStatus,
            is2FAEnabled: user.is2FAEnabled,
            totalYield
        }
    });
};
