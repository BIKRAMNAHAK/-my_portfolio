const SocialLink = require('../models/SocialLink');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getSocialLinks = asyncHandler(async (req, res) => {
  let social = await SocialLink.findOne();
  if (!social) {
    social = await SocialLink.create({
      github: 'https://github.com/bikramnahak',
      linkedin: 'https://linkedin.com/in/bikramnahak',
      email: 'bikramnahak9714@gmail.com',
    });
  }
  res.json({ success: true, data: social });
});

const updateSocialLinks = asyncHandler(async (req, res) => {
  let social = await SocialLink.findOne();

  if (!social) {
    social = await SocialLink.create(req.body);
  } else {
    Object.assign(social, req.body);
    await social.save();
  }

  res.json({ success: true, data: social });
});

module.exports = { getSocialLinks, updateSocialLinks };
