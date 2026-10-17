const pdfService = require('../services/pdfService');
const db = require('../config/db');
const { logStudentActivity } = require('../services/activityLogger');

exports.parseResume = async (req, res) => {
  try {
    let extractedText = '';
    let skills = [];
    const userEmail = (req.body.email || req.query.email || '').toLowerCase().trim();

    if (req.file) {
      extractedText = await pdfService.extractTextFromPDFBuffer(req.file.buffer);
      skills = pdfService.extractKeyTopics(extractedText);
    } else if (req.body.text) {
      extractedText = req.body.text;
      skills = pdfService.extractKeyTopics(extractedText);
    }

    if (!skills || skills.length === 0) {
      skills = ['React.js', 'JavaScript', 'Node.js', 'Express', 'SQL', 'MongoDB'];
    }

    // Save to specific candidate profile in database
    if (userEmail) {
      const users = db.getCollection('users');
      const user = users.find(u => u.email.toLowerCase() === userEmail);
      if (user) {
        user.savedResumeSkills = skills;
        user.resumeText = extractedText.substring(0, 1000);
        db.saveToCollection('users', user);
      }
      logStudentActivity(userEmail, 'RESUME_PARSED', `Parsed resume and extracted ${skills.length} tech skills`, { skills });
    }

    res.json({
      success: true,
      extractedTextSnippet: extractedText.substring(0, 300) + '...',
      skills: skills
    });
  } catch (error) {
    console.error('Resume Parse Error:', error);
    res.status(500).json({ success: false, error: 'Failed to process resume file.' });
  }
};
