const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getReports, submitReport } = require('../controllers/reportsController');

router.get('/', verifyToken, requireRole('ADMIN', 'MANAGER'), getReports);
router.post('/submit', verifyToken, requireRole('SUPERVISOR'), submitReport);

module.exports = router;
