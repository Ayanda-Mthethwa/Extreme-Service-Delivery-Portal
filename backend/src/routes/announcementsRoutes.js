const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getAnnouncements, createAnnouncement } = require('../controllers/announcementsController');

router.get('/', getAnnouncements);
router.post('/', verifyToken, requireRole('MANAGER', 'ADMIN'), createAnnouncement);

module.exports = router;
