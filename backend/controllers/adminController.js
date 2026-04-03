const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get all pending transactions for admin
// @route   GET /api/admin/pending-tx
// @access  Private/Admin
exports.getPendingTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ status: 'pending' }).populate('user', 'email name').sort('-timestamp');
        res.status(200).json({ success: true, data: transactions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all users for admin dashboard
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Approve/Reject transaction
// @route   PUT /api/admin/tx/:id
// @access  Private/Admin
exports.updateTransactionStatus = async (req, res) => {
    const { status } = req.body; // 'completed' or 'rejected'

    try {
        let transaction = await Transaction.findById(req.params.id).populate('user');

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        if (transaction.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Transaction already processed' });
        }

        // If Buy is approved, credit user's token balance
        if (transaction.type === 'buy' && status === 'completed') {
            const user = await User.findById(transaction.user._id);
            user.balances.tokenBalance += transaction.amount;
            await user.save();
        }

        // If Withdrawal is rejected, return balance to user
        if (transaction.type === 'withdraw' && status === 'rejected') {
            const user = await User.findById(transaction.user._id);
            if (transaction.currency === 'ARTH') {
                user.balances.tokenBalance += transaction.amount;
            } else {
                user.balances.incomeBalance += transaction.amount;
            }
            await user.save();
        }

        transaction.status = status;
        await transaction.save();

        res.status(200).json({
            success: true,
            message: `Transaction ${status}`,
            data: transaction
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update user details & balances
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    try {
        const { name, email, role, balances } = req.body;
        
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (balances) {
            user.balances = { ...user.balances, ...balances };
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User account deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all transactions for history
// @route   GET /api/admin/tx-history
// @access  Private/Admin
exports.getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('user', 'email name').sort('-timestamp');
        res.status(200).json({ success: true, data: transactions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get system-wide stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalStaked = await User.aggregate([{ $group: { _id: null, total: { $sum: "$balances.stakeBalance" } } }]);
        const totalPendingBuy = await Transaction.aggregate([
            { $match: { type: 'buy', status: 'pending' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStaked: totalStaked[0]?.total || 0,
                totalPendingBuy: totalPendingBuy[0]?.total || 0
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
