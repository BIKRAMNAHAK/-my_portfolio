const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = asyncHandler(async (req, res) => {
  const { name, mobile, email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({ name, mobile, email, password });

  res.json({
    success: true,
    data: {
      token: generateToken(user._id),
      user: { id: user._id, email: user.email, name: user.name, mobile: user.mobile },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  res.json({
    success: true,
    data: {
      token: generateToken(user._id),
      user: { id: user._id, email: user.email  ,name: user.name, mobile: user.mobile},
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { id: req.user._id, email: req.user.email , name: req.user.name, mobile: req.user.mobile},
  });
});

module.exports = { register, login, getMe };