const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema(
  {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SocialLink', socialLinkSchema);
