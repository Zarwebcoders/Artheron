const User = require('../models/User');
const Transaction = require('../models/Transaction');

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
