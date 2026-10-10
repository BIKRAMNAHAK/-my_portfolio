const Resume = require('../models/Resume');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPublicPath, deleteFile } = require('../middleware/upload');

const getActiveResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ isActive: true });
  if (!resume) throw new ApiError(404, 'No active resume found');
  res.json({ success: true, data: resume });
});

const getAllResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find().sort({ createdAt: -1 });
  res.json({ success: true, data: resumes });
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Resume file is required');

  const resumeCount = await Resume.countDocuments();
  const resume = await Resume.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: getPublicPath('resumes', req.file.filename),
    isActive: resumeCount === 0,
  });

  res.status(201).json({ success: true, data: resume });
});

const setActiveResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) throw new ApiError(404, 'Resume not found');

  await Resume.updateMany({ isActive: true }, { isActive: false });
  resume.isActive = true;
  await resume.save();

  res.json({ success: true, data: resume });
});

const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) throw new ApiError(404, 'Resume not found');

  const wasActive = resume.isActive;
  deleteFile(resume.path);
  await resume.deleteOne();

  if (wasActive) {
    const latest = await Resume.findOne().sort({ createdAt: -1 });
    if (latest) {
      latest.isActive = true;
      await latest.save();
    }
  }

  res.json({ success: true, message: 'Resume deleted successfully' });
});

module.exports = {
  getActiveResume,
  getAllResumes,
  uploadResume,
  setActiveResume,
  deleteResume,
};
