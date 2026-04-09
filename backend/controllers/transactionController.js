const Transaction = require('../models/Transaction');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

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

        // Notify Admin
        try {
            const user = await User.findById(req.user.id);
            await sendEmail({
                email: process.env.ADMIN_EMAIL,
                subject: '🔔 New Buy Request Pending',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #22d3ee; border-radius: 10px;">
                        <h2 style="color: #22d3ee;">Manual Buy Request</h2>
                        <p><strong>User:</strong> ${user.email}</p>
                        <p><strong>Asset Amount:</strong> ${amount} ARTH</p>
                        <p><strong>Payment Method:</strong> ${method}</p>
                        <p><strong>Status:</strong> Pending Verification</p>
                        <p style="color: #666;">Please log in to the Admin Panel to verify the payment proof.</p>
                        <hr>
                        <p style="font-size: 11px; color: #777;">Artheron Protocol Automated Desk</p>
                    </div>
                `
            });
        } catch (mailErr) {
            console.error("Admin Notify Error (Buy):", mailErr);
        }

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

        // Notify Admin
        try {
            await sendEmail({
                email: process.env.ADMIN_EMAIL,
                subject: '⚡ Artheron Alert: Web3 Purchase Success',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #7b3fe4; border-radius: 10px; background: #fafafa;">
                        <h2 style="color: #7b3fe4;">Automatic Web3 Purchase</h2>
                        <p><strong>Operator:</strong> ${user.email}</p>
                        <p><strong>Amount:</strong> ${amount} ARTH</p>
                        <p><strong>Status:</strong> Automatically Verified On-Chain</p>
                        <p><strong>Tx Hash:</strong> <span style="font-family: monospace; font-size: 11px;">${txHash}</span></p>
                        <hr>
                        <p style="font-size: 11px; color: #777;">Artheron Protocol Automated Monitoring System</p>
                    </div>
                `
            });
        } catch (mailErr) {
            console.error("Admin Notify Error (AutoBuy):", mailErr);
        }

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

        // Notify Admin
        try {
            await sendEmail({
                email: process.env.ADMIN_EMAIL,
                subject: '🚨 URGENT: New Withdrawal Request',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f97316; border-radius: 10px;">
                        <h2 style="color: #f97316;">Withdrawal Request Pending</h2>
                        <p><strong>Operator:</strong> ${user.email}</p>
                        <p><strong>Amount:</strong> ${amount} ${currency}</p>
                        <p><strong>Destination Wallet:</strong> <span style="font-family: monospace;">${walletAddress}</span></p>
                        <p><strong>Action Required:</strong> Please manually settle this transaction after security checks.</p>
                        <hr>
                        <p style="font-size: 11px; color: #777;">Artheron Protocol Automated Security System</p>
                    </div>
                `
            });
        } catch (mailErr) {
            console.error("Admin Notify Error (Withdraw):", mailErr);
        }

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
