const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');

router.get('/hr', questionsController.getHrQuestions);
router.get('/gd', questionsController.getGdTopics);
router.get('/technical', questionsController.getTechnicalQuestions);

module.exports = router;
