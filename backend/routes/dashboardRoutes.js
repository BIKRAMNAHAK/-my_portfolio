const express = require('express');
const { getStats, getVisitors } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, getStats);
router.get('/visitors', protect, getVisitors);

module.exports = router;
