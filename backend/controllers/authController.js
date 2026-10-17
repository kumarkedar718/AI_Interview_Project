const bcrypt = require('bcryptjs');
const User = require('../models/User');
const db = require('../config/db');
const { logStudentActivity } = require('../services/activityLogger');

exports.register = async (req, res) => {
  try {
    const { name, email, password, targetRole, experienceLevel } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email and password are required fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    
    // Check existing user via Mongoose when connected or JsonDB fallback
    let existingUser = null;
    if (db.isDbConnected()) {
      try {
        existingUser = await User.findOne({ email: cleanEmail });
      } catch (e) {
        console.warn('Mongoose User check warning:', e.message);
      }
    }

    if (!existingUser) {
      const users = db.getCollection('users');
      existingUser = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    }

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists. Please login.' });
    }

    // Hash user password securely using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    let defaultSkills = [];
    if (targetRole === 'Backend Developer') {
      defaultSkills = ['Node.js', 'Express', 'SQL', 'MongoDB', 'REST APIs'];
    } else if (targetRole === 'DevOps & Cloud Engineer') {
      defaultSkills = ['Docker', 'Kubernetes', 'AWS', 'CI/CD Pipelines', 'Linux'];
    } else if (targetRole === 'Data Engineer / Scientist') {
      defaultSkills = ['Python', 'SQL', 'PySpark', 'ETL Pipelines', 'Machine Learning'];
    } else if (targetRole === 'HR / Project Manager') {
      defaultSkills = ['Agile Scrum', 'Team Leadership', 'Project Roadmap', 'Conflict Resolution'];
    } else {
      defaultSkills = ['React.js', 'JavaScript', 'State Management', 'REST APIs'];
    }

    const userId = `usr_${Date.now()}`;
    const userData = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      targetRole: targetRole || 'Frontend Developer',
      experienceLevel: experienceLevel || 'Intermediate (1-3 years)',
      savedResumeSkills: defaultSkills,
      createdAt: new Date().toISOString()
    };

    // Save User into MongoDB via Mongoose
    if (db.isDbConnected()) {
      try {
        const newUserDoc = new User(userData);
        await newUserDoc.save();
      } catch (mongoErr) {
        console.warn('MongoDB User save notice:', mongoErr.message);
      }
    }

    // Always mirror to JsonDB backup
    db.saveToCollection('users', userData);
    logStudentActivity(cleanEmail, 'REGISTRATION', `New candidate account created for ${name} (${targetRole})`);

    const userProfile = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      targetRole: targetRole || 'Frontend Developer',
      experienceLevel: experienceLevel || 'Intermediate (1-3 years)',
      savedResumeSkills: defaultSkills
    };

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      user: userProfile
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Failed to complete user registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Query user from MongoDB
    let user = null;
    if (db.isDbConnected()) {
      try {
        user = await User.findOne({ email: cleanEmail });
      } catch (e) {
        console.warn('Mongoose User login query notice:', e.message);
      }
    }

    if (!user) {
      const users = db.getCollection('users');
      user = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password credentials.' });
    }

    // Compare bcrypt hashed password
    let isMatch = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password credentials.' });
    }

    logStudentActivity(cleanEmail, 'LOGIN', `Student candidate logged in`);

    const userProfile = {
      id: user.id || user._id ? user._id.toString() : `usr_${Date.now()}`,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole || 'Frontend Developer',
      experienceLevel: user.experienceLevel || 'Intermediate (1-3 years)',
      savedResumeSkills: user.savedResumeSkills || ['React.js', 'JavaScript', 'REST APIs']
    };

    res.json({
      success: true,
      message: 'Login successful!',
      user: userProfile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Failed to authenticate candidate credentials.' });
  }
};
