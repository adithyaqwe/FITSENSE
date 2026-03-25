const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { submitReport, getReports } = require('../controllers/reportController');

const router = express.Router();

router.use(protect);

router.post('/submit', submitReport);
router.get('/my-reports', getReports);

module.exports = router;
