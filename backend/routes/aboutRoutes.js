const express = require('express');
const { getAbout, updateAbout } = require('../controllers/aboutController');
const { protect } = require('../middleware/auth');
const { uploadProfileImage } = require('../middleware/upload');

const router = express.Router();

router.get('/', getAbout);
router.put('/', protect, uploadProfileImage, updateAbout);

module.exports = router;
