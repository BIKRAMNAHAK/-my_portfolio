const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Message = require('../models/Message');
const Visitor = require('../models/Visitor');
const Education = require('../models/Education');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [projects, skills, experiences, education, messages, unreadMessages, uniqueIps, todayVisitors] =
    await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ status: 'unread' }),
      Visitor.distinct('ip'),
      Visitor.countDocuments({
        date: { $gte: startOfDay },
      }),
    ]);

  res.json({
    success: true,
    data: {
      projects,
      skills,
      experiences,
      education,
      messages,
      unreadMessages,
      visitors: uniqueIps.length,
      todayVisitors,
    },
  });
});

const getVisitors = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.date) {
    const day = new Date(req.query.date);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    filter.date = { $gte: day, $lt: nextDay };
  }

  const [visitors, total] = await Promise.all([
    Visitor.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
    Visitor.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: visitors,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const trackVisitor = asyncHandler(async (req, res) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    'anonymous';
  const userAgent = req.headers['user-agent'] || '';

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Check if same IP already recorded today
  const existingToday = await Visitor.findOne({
    ip,
    date: { $gte: startOfDay },
  });

  if (!existingToday) {
    const visitor = await Visitor.create({ ip, userAgent, date: new Date() });
    return res.status(201).json({ success: true, isNew: true, data: visitor });
  }

  res.json({ success: true, isNew: false, message: 'Visit already recorded today' });
});

module.exports = { getStats, getVisitors, trackVisitor };
