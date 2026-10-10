const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Message = require('../models/Message');
const Visitor = require('../models/Visitor');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const [projects, skills, experiences, messages, unreadMessages, visitors, todayVisitors] =
    await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ status: 'unread' }),
      Visitor.countDocuments(),
      Visitor.countDocuments({
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      }),
    ]);

  res.json({
    success: true,
    data: {
      projects,
      skills,
      experiences,
      messages,
      unreadMessages,
      visitors,
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
    req.socket.remoteAddress ||
    '';
  const userAgent = req.headers['user-agent'] || '';

  const visitor = await Visitor.create({ ip, userAgent, date: new Date() });

  res.status(201).json({ success: true, data: visitor });
});

module.exports = { getStats, getVisitors, trackVisitor };
