const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    professionalTitle: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    yearsExperience: {
      type: Number,
      default: 0,
    },
    projectsCompleted: {
      type: Number,
      default: 0,
    },
    technologiesCount: {
      type: Number,
      default: 0,
    },
    passion: {
      type: String,
      default: '',
    },
    currentRole: {
      type: String,
      default: '',
    },
    animatedTitles: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('About', aboutSchema);
