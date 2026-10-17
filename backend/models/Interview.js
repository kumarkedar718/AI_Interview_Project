const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
    required: true,
    enum: ['Technical', 'HR', 'GD', 'Behavioral', 'System Architecture']
  },
  durationMinutes: {
    type: Number,
    default: 10
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  skills: [{
    type: String
  }],
  totalQuestions: {
    type: Number,
    default: 0
  },
  questionsAttempted: {
    type: Number,
    default: 0
  },
  overallScore: {
    type: Number,
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
  status: {
    type: String,
    enum: ['active', 'completed', 'in-progress'],
    default: 'active',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.models.Interview || mongoose.model('Interview', interviewSchema);
