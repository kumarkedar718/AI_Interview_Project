const mongoose = require('mongoose');

const interviewReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
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
  jobRole: {
    type: String,
    required: true
  },
  roundType: {
    type: String,
    required: true
  },
  overallScore: {
    type: Number,
    required: true,
    default: 0
  },
  technicalScore: {
    type: Number,
    default: 0
  },
  communicationScore: {
    type: Number,
    default: 0
  },
  problemSolvingScore: {
    type: Number,
    default: 0
  },
  strongSkills: [{
    type: String
  }],
  needsImprovement: [{
    type: String
  }],
  personalizedPrepPlan: [{
    topic: String,
    priority: String,
    action: String
  }],
  questionReviews: [{
    questionNumber: Number,
    question: String,
    skill: String,
    candidateAnswer: String,
    idealAnswer: String,
    score: Number,
    correctnessPercentage: Number,
    gapPercentage: Number,
    feedback: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.models.InterviewReport || mongoose.model('InterviewReport', interviewReportSchema);
