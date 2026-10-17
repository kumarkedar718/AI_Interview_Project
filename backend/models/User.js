const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    default: 'Frontend Developer'
  },
  experienceLevel: {
    type: String,
    default: 'Intermediate (1-3 years)'
  },
  savedResumeSkills: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
