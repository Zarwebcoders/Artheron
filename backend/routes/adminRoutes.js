const express = require('express');
const { 
    getAllUsers, 
    getPendingTransactions, 
    updateTransactionStatus, 
    getStats,
    updateUser,
    deleteUser,
    getTransactionHistory
} = require('../controllers/adminController');
const { distributeROI } = require('../controllers/assetController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/tx-history', getTransactionHistory);
router.get('/pending-tx', getPendingTransactions);
router.put('/tx/:id', updateTransactionStatus);
router.get('/stats', getStats);
router.post('/distribute-roi', distributeROI);

module.exports = router;
