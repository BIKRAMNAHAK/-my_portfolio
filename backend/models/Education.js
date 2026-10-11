const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'Institution / College is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree / Course is required'],
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      default: null,
    },
    current: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);
