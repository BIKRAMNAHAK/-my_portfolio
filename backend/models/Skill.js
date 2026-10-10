const mongoose = require('mongoose');

const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Mobile', 'Tools'];

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: SKILL_CATEGORIES,
    },
    icon: {
      type: String,
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
module.exports.SKILL_CATEGORIES = SKILL_CATEGORIES;
