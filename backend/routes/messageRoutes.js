const express = require('express');
const {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', createMessage);
router.get('/', protect, getMessages);
router.put('/:id', protect, updateMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
