const Skill = require('../models/Skill');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find().sort({ displayOrder: 1, createdAt: -1 });
  res.json({ success: true, data: skills });
});

const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({ success: true, data: skill });
});

const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) throw new ApiError(404, 'Skill not found');
  res.json({ success: true, data: skill });
});

const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) throw new ApiError(404, 'Skill not found');
  await skill.deleteOne();
  res.json({ success: true, message: 'Skill deleted successfully' });
});

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
