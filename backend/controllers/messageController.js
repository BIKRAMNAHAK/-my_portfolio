const Message = require('../models/Message');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactNotification, sendUserAcknowledgment } = require('../utils/mailer');

const createMessage = asyncHandler(async (req, res) => {
  const message = await Message.create(req.body);

  // Send emails in background without blocking response
  sendContactNotification(message).catch((err) => {
    console.error('Failed to send admin contact notification:', err.message);
  });

  if (message.email) {
    sendUserAcknowledgment(message).catch((err) => {
      console.error('Failed to send acknowledgment email:', err.message);
    });
  }

  res.status(201).json({
    success: true,
    message: 'Message sent successfully! Thank you for contacting.',
    data: message,
  });
});

const getMessages = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.status && ['read', 'unread'].includes(req.query.status)) {
    filter.status = req.query.status;
  }

  if (req.query.search) {
    const search = req.query.search.trim();
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const [messages, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Message.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: messages,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const updateMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) throw new ApiError(404, 'Message not found');

  const { status } = req.body;
  if (!status || !['read', 'unread'].includes(status)) {
    throw new ApiError(400, 'Status must be "read" or "unread"');
  }

  message.status = status;
  message.readAt = status === 'read' ? new Date() : null;
  await message.save();

  res.json({ success: true, data: message });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) throw new ApiError(404, 'Message not found');
  await message.deleteOne();
  res.json({ success: true, message: 'Message deleted successfully' });
});

module.exports = { createMessage, getMessages, updateMessage, deleteMessage };
