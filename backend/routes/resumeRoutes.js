const express = require('express');
const { getActiveResume } = require('../controllers/resumeController');

const router = express.Router();

router.get('/', getActiveResume);

module.exports = router;
