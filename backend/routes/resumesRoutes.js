const express = require('express');
const {
  getAllResumes,
  uploadResume,
  setActiveResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { uploadResume: uploadResumeMiddleware } = require('../middleware/upload');

const router = express.Router();

router.get('/', protect, getAllResumes);
router.post('/', protect, uploadResumeMiddleware, uploadResume);
router.put('/:id', protect, setActiveResume);
router.delete('/:id', protect, deleteResume);

module.exports = router;
