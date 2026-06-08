const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getNotifications, deleteNotification, sendNotification } = require('../controllers/notificationsController');

router.get('/:userID', getNotifications);
router.delete('/:notificationID', verifyToken, deleteNotification);
router.post('/send', verifyToken, sendNotification);

module.exports = router;
