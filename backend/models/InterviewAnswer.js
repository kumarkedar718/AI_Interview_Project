const mongoose = require('mongoose');

const interviewAnswerSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  questionId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  skill: {
    type: String,
    default: 'General'
  },
  candidateAnswer: {
    type: String,
    default: ''
  },
  isSkipped: {
    type: Boolean,
    default: false
  },
  correctnessPercentage: {
    type: Number,
    default: 0
  },
  gapPercentage: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  idealAnswer: {
    type: String,
    default: ''
  },
  identifiedSkillGaps: [{
    type: String
  }],
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.models.InterviewAnswer || mongoose.model('InterviewAnswer', interviewAnswerSchema);
