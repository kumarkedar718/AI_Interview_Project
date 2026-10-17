const db = require('../config/db');

function logStudentActivity(userEmail, activityType, description, meta = {}) {
  if (!userEmail) return;

  const activityObj = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    userEmail: userEmail.toLowerCase().trim(),
    activityType, // e.g. 'LOGIN', 'RESUME_PARSED', 'INTERVIEW_STARTED', 'INTERVIEW_COMPLETED', 'PROFILE_UPDATED'
    description,
    meta,
    timestamp: new Date().toISOString()
  };

  db.saveToCollection('activities', activityObj);
  console.log(`📌 Database Activity Logged [${activityType}] for ${userEmail}: ${description}`);
  return activityObj;
}

module.exports = {
  logStudentActivity
};
