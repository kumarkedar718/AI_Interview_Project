const { JsonDB } = require('../config/db');
const InterviewReport = require('../models/InterviewReport');
const Interview = require('../models/Interview');
const InterviewAnswer = require('../models/InterviewAnswer');

exports.getHistory = async (req, res) => {
  try {
    const userEmail = (req.query.email || '').toLowerCase().trim();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!userEmail) {
      return res.json({ success: true, history: [], pagination: { total: 0, page, pages: 0 } });
    }

    let historyList = [];
    let totalCount = 0;

    try {
      totalCount = await InterviewReport.countDocuments({ userEmail });
      const docs = await InterviewReport.find({ userEmail })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      if (docs && docs.length > 0) {
        historyList = docs.map(d => ({
          id: d.reportId || d.sessionId || d._id.toString(),
          sessionId: d.sessionId,
          userEmail: d.userEmail,
          date: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
          jobRole: d.jobRole,
          roundType: d.roundType,
          overallScore: d.overallScore,
          technicalScore: d.technicalScore,
          communicationScore: d.communicationScore,
          problemSolvingScore: d.problemSolvingScore,
          strongSkills: d.strongSkills,
          needsImprovement: d.needsImprovement,
          evaluation: {
            overallScore: d.overallScore,
            technicalScore: d.technicalScore,
            communicationScore: d.communicationScore,
            problemSolvingScore: d.problemSolvingScore,
            strongSkills: d.strongSkills,
            needsImprovement: d.needsImprovement,
            questionReviews: d.questionReviews || [],
            personalizedPrepPlan: d.personalizedPrepPlan || []
          }
        }));
      }
    } catch (mongoErr) {
      console.warn('MongoDB History query notice:', mongoErr.message);
    }

    // Fallback to local DB if Mongo query returned 0 items
    if (historyList.length === 0) {
      const allHistory = JsonDB.getCollection('history');
      const filtered = allHistory.filter(h => 
        h.userEmail && h.userEmail.toLowerCase().trim() === userEmail
      ).reverse();

      totalCount = filtered.length;
      historyList = filtered.slice(skip, skip + limit);
    }

    res.json({
      success: true,
      history: historyList,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit) || 1
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ success: false, error: 'Could not retrieve interview history.' });
  }
};

exports.getHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = (req.query.email || '').toLowerCase().trim();

    let reportDoc = null;
    try {
      reportDoc = await InterviewReport.findOne({
        userEmail,
        $or: [{ reportId: id }, { sessionId: id }]
      }).lean();
    } catch (e) {}

    if (reportDoc) {
      const evaluationObj = {
        overallScore: reportDoc.overallScore,
        technicalScore: reportDoc.technicalScore,
        communicationScore: reportDoc.communicationScore,
        problemSolvingScore: reportDoc.problemSolvingScore,
        strongSkills: reportDoc.strongSkills,
        needsImprovement: reportDoc.needsImprovement,
        questionReviews: reportDoc.questionReviews || [],
        personalizedPrepPlan: reportDoc.personalizedPrepPlan || []
      };

      return res.json({
        success: true,
        report: evaluationObj,
        metadata: {
          id: reportDoc.reportId || id,
          sessionId: reportDoc.sessionId,
          userEmail: reportDoc.userEmail,
          jobRole: reportDoc.jobRole,
          roundType: reportDoc.roundType,
          date: reportDoc.createdAt ? reportDoc.createdAt.toISOString() : new Date().toISOString()
        }
      });
    }

    // Fallback to local DB
    const history = JsonDB.getCollection('history');
    const item = history.find(h => 
      (h.id === id || h.sessionId === id) && 
      (h.userEmail && h.userEmail.toLowerCase().trim() === userEmail)
    );

    if (!item) {
      return res.status(404).json({ success: false, error: 'Report not found for this candidate email.' });
    }

    res.json({ success: true, report: item.evaluation, metadata: item });
  } catch (error) {
    console.error('Get history item error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch interview report.' });
  }
};

exports.deleteHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = (req.query.email || '').toLowerCase().trim();

    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'User email is required to delete an interview record.' });
    }

    try {
      await InterviewReport.deleteMany({
        userEmail,
        $or: [{ reportId: id }, { sessionId: id }]
      });
      await Interview.deleteMany({
        userEmail,
        sessionId: id
      });
      await InterviewAnswer.deleteMany({
        userEmail,
        sessionId: id
      });
    } catch (mongoErr) {
      console.warn('MongoDB delete notice:', mongoErr.message);
    }

    // Mirror to local DB engine
    const data = JsonDB.read();
    if (data.history) {
      data.history = data.history.filter(h => !( (h.id === id || h.sessionId === id || h.reportId === id) && h.userEmail && h.userEmail.toLowerCase().trim() === userEmail ));
    }
    if (data.sessions) {
      data.sessions = data.sessions.filter(s => !( (s.id === id || s.sessionId === id) && s.userEmail && s.userEmail.toLowerCase().trim() === userEmail ));
    }
    JsonDB.write(data);

    res.json({ success: true, message: 'Interview record deleted successfully.' });
  } catch (error) {
    console.error('Delete history item error:', error);
    res.status(500).json({ success: false, error: 'Could not delete interview record.' });
  }
};
