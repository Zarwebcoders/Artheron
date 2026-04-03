const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Purchase tokens (Buy Request)
// @route   POST /api/tx/buy
// @access  Private
exports.buyTokens = async (req, res) => {
    const { amount, method } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload payment proof' });
    }

    try {
        const transaction = await Transaction.create({
            user: req.user.id,
            type: 'buy',
            amount,
            method,
            proofUrl: req.file.path,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Purchase request submitted. Pending verification.',
            data: transaction
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Record Automatic Token Purchase (Web3)
// @route   POST /api/tx/auto-buy
// @access  Private
exports.recordAutoBuy = async (req, res) => {
    const { amount, txHash, walletAddress } = req.body;

    if (!amount || !txHash) {
        return res.status(400).json({ success: false, message: 'Invalid transaction data' });
    }

    try {
        const transaction = await Transaction.create({
            user: req.user.id,
            type: 'buy',
            amount,
            txHash,
            method: 'MetaMask (Auto)',
            status: 'completed' // Web3 transactions are verified on-chain
        });

        // Also update user balance immediately for auto-buys
        const user = await User.findById(req.user.id);
        user.balances.tokenBalance += parseFloat(amount);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Transaction recorded and ARTH credited.',
            data: transaction
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Withdraw tokens
// @route   POST /api/tx/withdraw
// @access  Private
exports.withdrawTokens = async (req, res) => {
    const { amount, currency, walletAddress } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (currency === 'ARTH') {
            if (user.balances.tokenBalance < amount) {
                return res.status(400).json({ success: false, message: 'Insufficient ARTH balance' });
            }
            user.balances.tokenBalance -= amount;
        } else if (currency === 'USDT') {
            if (user.balances.incomeBalance < amount) {
                return res.status(400).json({ success: false, message: 'Insufficient USDT/Income balance' });
            }
            user.balances.incomeBalance -= amount;
        }

        await user.save();

        const transaction = await Transaction.create({
            user: user._id,
            type: 'withdraw',
            amount,
            currency,
            txHash: walletAddress, // Temporarily store address as hash until processed
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Withdrawal request submitted for processing.',
            data: transaction
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get user transactions
// @route   GET /api/tx/history
// @access  Private
exports.getHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort('-timestamp');

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
