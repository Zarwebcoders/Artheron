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
        const ARTH_PRICE = 0.010417;
        
        // All withdrawals deduct from ARTH balance (tokenBalance)
        if (user.balances.tokenBalance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient ARTH balance' });
        }

        let fee = 0;
        let settlementAmount = amount;

        if (currency === 'USDT') {
            const grossUSD = amount * ARTH_PRICE;
            fee = 1; // 1 USDT fixed fee
            settlementAmount = grossUSD - fee;

            if (settlementAmount <= 0) {
                return res.status(400).json({ success: false, message: 'Withdrawal amount too low to cover gas fees' });
            }
        }

        // Deduct full ARTH amount from operator
        user.balances.tokenBalance -= amount;
        await user.save();

        const transaction = await Transaction.create({
            user: user._id,
            type: 'withdraw',
            amount, // Original ARTH amount
            currency,
            fee,
            settlementAmount,
            txHash: walletAddress, 
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

// @desc    Get live protocol stats (public)
// @route   GET /api/tx/stats
// @access  Private
exports.getPublicStats = async (req, res) => {
    try {
        // Total Minted = sum of all ARTH balances across all accounts
        const totalMintedArr = await User.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $add: [
                                { $ifNull: ["$balances.tokenBalance", 0] },
                                { $ifNull: ["$balances.stakeBalance", 0] },
                                { $ifNull: ["$balances.incomeBalance", 0] }
                            ]
                        }
                    }
                }
            }
        ]);

        // 24h Buy Volume (Completed only)
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const buyVolumeArr = await Transaction.aggregate([
            {
                $match: {
                    type: 'buy',
                    status: 'completed',
                    timestamp: { $gte: dayAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalMinted = totalMintedArr[0]?.total || 0;
        const buyVolumeARTH = buyVolumeArr[0]?.total || 0;
        const buyVolumeUSD = buyVolumeARTH * 0.010417; // price constant

        res.status(200).json({
            success: true,
            data: {
                totalMinted,
                buyVolumeUSD,
                timestamp: new Date()
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
