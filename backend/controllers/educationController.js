const Education = require('../models/Education');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getEducation = asyncHandler(async (req, res) => {
  const education = await Education.find().sort({ startDate: -1 });
  res.json({ success: true, data: education });
});

const createEducation = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.current) {
    data.endDate = null;
  }
  const education = await Education.create(data);
  res.status(201).json({ success: true, data: education });
});

const updateEducation = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.current) {
    data.endDate = null;
  }
  const education = await Education.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!education) throw new ApiError(404, 'Education record not found');
  res.json({ success: true, data: education });
});

const deleteEducation = asyncHandler(async (req, res) => {
  const education = await Education.findById(req.params.id);
  if (!education) throw new ApiError(404, 'Education record not found');
  await education.deleteOne();
  res.json({ success: true, message: 'Education record deleted successfully' });
});

module.exports = {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};
