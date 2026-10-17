const presets = require('../data/presetQuestions.json');

exports.getHrQuestions = (req, res) => {
  res.json({
    success: true,
    questions: presets.hr || []
  });
};

exports.getGdTopics = (req, res) => {
  res.json({
    success: true,
    topics: presets.gd || []
  });
};

exports.getTechnicalQuestions = (req, res) => {
  res.json({
    success: true,
    questions: presets.technical || []
  });
};
