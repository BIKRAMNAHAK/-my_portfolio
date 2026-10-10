const express = require('express');
const { getSocialLinks, updateSocialLinks } = require('../controllers/socialController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSocialLinks);
router.put('/', protect, updateSocialLinks);

module.exports = router;
