const About = require('../models/About');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPublicPath, deleteFile } = require('../middleware/upload');

const parseAnimatedTitles = (value) => {
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

const getAbout = asyncHandler(async (req, res) => {
  let about = await About.findOne();
  if (!about) {
    about = await About.create({
      name: 'Bikram Nahak',
      professionalTitle: 'Full Stack Developer',
      bio: '',
      email: 'bikramnahak9714@gmail.com',
      animatedTitles: ['Full Stack Developer', 'MERN Stack Developer', 'React Native Developer'],
    });
  }
  res.json({ success: true, data: about });
});

const updateAbout = asyncHandler(async (req, res) => {
  let about = await About.findOne();
  const data = { ...req.body };

  if (data.animatedTitles !== undefined) {
    data.animatedTitles = parseAnimatedTitles(data.animatedTitles);
  }
  if (data.yearsExperience !== undefined) data.yearsExperience = Number(data.yearsExperience);
  if (data.projectsCompleted !== undefined) data.projectsCompleted = Number(data.projectsCompleted);
  if (data.technologiesCount !== undefined) data.technologiesCount = Number(data.technologiesCount);

  if (req.file) {
    if (about?.profileImage && !about.profileImage.startsWith('data:') && !about.profileImage.startsWith('http')) {
      deleteFile(about.profileImage);
    }
    data.profileImage = getPublicPath('profiles', req.file.filename);
  }

  if (!about) {
    about = await About.create(data);
  } else {
    Object.assign(about, data);
    await about.save();
  }

  res.json({ success: true, data: about });
});

module.exports = { getAbout, updateAbout };
