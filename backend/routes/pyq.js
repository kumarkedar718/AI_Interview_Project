const express = require('express');
const router = express.Router();
const multer = require('multer');
const pyqController = require('../controllers/pyqController');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for photos/PDFs
});

router.get('/', pyqController.getPyqs);
router.post('/add', pyqController.addCustomPyq);
router.post('/upload-file', upload.single('file'), pyqController.uploadPyqFile);

module.exports = router;
