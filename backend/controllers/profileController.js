const User = require('../models/User');
const db = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase().trim();

    let user = null;
    if (email) {
      try {
        user = await User.findOne({ email }).lean();
      } catch (e) {}
    }

    if (!user) {
      const users = db.getCollection('users');
      user = users.find(u => u.email && u.email.toLowerCase() === email) || users[0] || {
        id: 'usr_default',
        name: 'Student Candidate',
        email: email || 'student@example.com',
        targetRole: 'Frontend Developer',
        experienceLevel: 'Intermediate (1-3 years)',
        savedResumeSkills: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'SQL']
      };
    }

    const { password: _, ...profile } = user;
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, error: 'Could not fetch user profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, name, targetRole, experienceLevel, savedResumeSkills } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail) {
      return res.status(400).json({ success: false, error: 'User email is required to update profile.' });
    }

    let updatedUser = null;
    try {
      updatedUser = await User.findOneAndUpdate(
        { email: cleanEmail },
        {
          ...(name && { name }),
          ...(targetRole && { targetRole }),
          ...(experienceLevel && { experienceLevel }),
          ...(savedResumeSkills && { savedResumeSkills })
        },
        { new: true, upsert: true }
      ).lean();
    } catch (e) {
      console.warn('MongoDB profile update notice:', e.message);
    }

    // Mirror to JsonDB
    const users = db.getCollection('users');
    let dbUser = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (dbUser) {
      if (name) dbUser.name = name;
      if (targetRole) dbUser.targetRole = targetRole;
      if (experienceLevel) dbUser.experienceLevel = experienceLevel;
      if (savedResumeSkills) dbUser.savedResumeSkills = savedResumeSkills;
      db.saveToCollection('users', dbUser);
    }

    const finalProfile = updatedUser || dbUser || {
      name,
      email: cleanEmail,
      targetRole,
      experienceLevel,
      savedResumeSkills
    };

    const { password: _, ...profile } = finalProfile;
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update user profile.' });
  }
};
