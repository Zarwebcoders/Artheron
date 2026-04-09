const User = require('../models/User');
const Transaction = require('../models/Transaction');
const sendEmail = require('../utils/sendEmail');

// @desc    Stake tokens
// @route   POST /api/assets/stake
// @access  Private
exports.stakeTokens = async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (user.balances.tokenBalance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient $ARTH balance' });
        }

        // Update balances
        user.balances.tokenBalance -= amount;
        user.balances.stakeBalance += amount;
        await user.save();

        // Create transaction log
        await Transaction.create({
            user: user._id,
            type: 'stake',
            amount,
            status: 'completed'
        });

        // Notify Admin
        try {
            await sendEmail({
                email: process.env.ADMIN_EMAIL,
                subject: 'Artheron Alert: New Stake Activity',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #7b3fe4; border-radius: 10px;">
                        <h2 style="color: #7b3fe4;">New Stake Activity Detected</h2>
                        <p><strong>Operator:</strong> ${user.email}</p>
                        <p><strong>Amount:</strong> ${amount} ARTH</p>
                        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                        <hr>
                        <p style="font-size: 11px; color: #777;">Artheron Protocol Automated Monitoring System</p>
                    </div>
                `
            });
        } catch (mailErr) {
            console.error("Admin Notify Error (Stake):", mailErr);
        }

        res.status(200).json({
            success: true,
            data: user.balances
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Claim earnings
// @route   POST /api/assets/claim
// @access  Private
exports.claimEarnings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.balances.incomeBalance <= 0) {
            return res.status(400).json({ success: false, message: 'No earnings to claim' });
        }

        const amount = user.balances.incomeBalance;

        // Update balances
        user.balances.tokenBalance += amount;
        user.balances.incomeBalance = 0;
        await user.save();

        // Create transaction log
        await Transaction.create({
            user: user._id,
            type: 'claim',
            amount,
            status: 'completed'
        });

        // Notify Admin
        try {
            await sendEmail({
                email: process.env.ADMIN_EMAIL,
                subject: 'Artheron Alert: Earnings Claimed',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #22C55E; border-radius: 10px;">
                        <h3 style="color: #22C55E;">Earning Claim Detected</h3>
                        <p><strong>Operator:</strong> ${user.email}</p>
                        <p><strong>Amount:</strong> ${amount} ARTH</p>
                        <p><strong>Status:</strong> Completed</p>
                        <hr>
                        <p style="font-size: 11px; color: #777;">Artheron Protocol Automated Monitoring System</p>
                    </div>
                `
            });
        } catch (mailErr) {
            console.error("Admin Notify Error (Claim):", mailErr);
        }

        res.status(200).json({
            success: true,
            data: user.balances
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Emergency SOS Exit (20% penalty)
// @route   POST /api/assets/sos
// @access  Private
exports.sosExit = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.balances.stakeBalance <= 0) {
            return res.status(400).json({ success: false, message: 'No active stake to liquidate' });
        }

        const stakedAmount = user.balances.stakeBalance;
        const penalty = stakedAmount * 0.20;
        const netReturn = stakedAmount - penalty;

        // Update balances
        user.balances.tokenBalance += netReturn;
        user.balances.stakeBalance = 0;
        await user.save();

        // Create transaction log
        await Transaction.create({
            user: user._id,
            type: 'sos',
            amount: stakedAmount,
            status: 'completed'
        });

        // Notify Admin
        try {
            await sendEmail({
                email: process.env.ADMIN_EMAIL,
                subject: '⚠️ SECURITY ALERT: SOS Exit Triggered',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #EF4444; border-radius: 10px; background: #FFF5F5;">
                        <h2 style="color: #EF4444;">SOS EMERGENCY EXIT</h2>
                        <p><strong>Operator:</strong> ${user.email}</p>
                        <p><strong>Staked Asset:</strong> ${stakedAmount} ARTH</p>
                        <p><strong>Net Return (After 20% Penalty):</strong> ${netReturn} ARTH</p>
                        <p style="color: #666;">This action was initiated via the SOS emergency protocol.</p>
                        <hr>
                        <p style="font-size: 11px; color: #777;">Artheron Protocol Automated Security System</p>
                    </div>
                `
            });
        } catch (mailErr) {
            console.error("Admin Notify Error (SOS):", mailErr);
        }

        res.status(200).json({
            success: true,
            message: 'SOS Exit successful. 20% penalty applied.',
            data: user.balances
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Distribute Daily ROI (0.2%)
// @route   POST /api/admin/distribute-roi
// @access  Private/Admin
exports.distributeROI = async (req, res) => {
    try {
        const users = await User.find({ 'balances.stakeBalance': { $gt: 0 } });
        
        let count = 0;
        for (let user of users) {
            const dailyYield = user.balances.stakeBalance * 0.002; // 0.2% daily
            user.balances.incomeBalance += dailyYield;
            await user.save();
            count++;
        }
        
        res.status(200).json({
            success: true,
            message: `ROI Distributed to ${count} operators successfully.`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
