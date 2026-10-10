const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    detailedDescription: {
      type: String,
      default: '',
      trim: true,
    },

    technologies: {
      type: [String],
      default: [],
    },

    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },

    liveUrl: {
      type: String,
      default: '',
      trim: true,
    },

    image: {
      type: String,
      default: '',
    },

    features: {
      type: [String],
      default: [],
    },

    challenges: {
      type: String,
      default: '',
      trim: true,
    },

    solutions: {
      type: String,
      default: '',
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Project', projectSchema)