const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/parse', upload.single('resume'), resumeController.parseResume);

module.exports = router;
