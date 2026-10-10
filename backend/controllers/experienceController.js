const Experience = require('../models/Experience');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const parseTechnologies = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find().sort({ startDate: -1 });
  res.json({ success: true, data: experiences });
});

const createExperience = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  data.technologies = parseTechnologies(data.technologies);
  const experience = await Experience.create(data);
  res.status(201).json({ success: true, data: experience });
});

const updateExperience = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.technologies !== undefined) {
    data.technologies = parseTechnologies(data.technologies);
  }

  const experience = await Experience.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!experience) throw new ApiError(404, 'Experience not found');
  res.json({ success: true, data: experience });
});

const deleteExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) throw new ApiError(404, 'Experience not found');
  await experience.deleteOne();
  res.json({ success: true, message: 'Experience deleted successfully' });
});

module.exports = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};
