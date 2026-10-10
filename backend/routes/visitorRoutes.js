const express = require('express');
const { trackVisitor } = require('../controllers/dashboardController');

const router = express.Router();

router.post('/', trackVisitor);

module.exports = router;
