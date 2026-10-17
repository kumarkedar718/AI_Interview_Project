const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/start', interviewController.startSession);
router.post('/answer', interviewController.submitAnswer);
router.post('/help', interviewController.getAnswerHelp);
router.post('/end', interviewController.endSession);

module.exports = router;
