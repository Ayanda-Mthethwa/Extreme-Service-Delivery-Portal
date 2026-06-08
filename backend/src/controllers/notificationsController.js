const pool = require('../config/db');

// GET /api/notifications/:userID
const getNotifications = async (req, res) => {
  const { userID } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userID]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/notifications/:notificationID
const deleteNotification = async (req, res) => {
  const { notificationID } = req.params;
  try {
    await pool.query('DELETE FROM notifications WHERE id = $1', [notificationID]);
    res.json({ message: 'Notification deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/notifications/send
const sendNotification = async (req, res) => {
  const { userId, title, message } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, message]
    );
    res.status(201).json({ message: 'Notification sent.', notification: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getNotifications, deleteNotification, sendNotification };
