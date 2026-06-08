const pool = require('../config/db');

// GET /api/announcements
const getAnnouncements = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.*, u.name AS created_by_name, u.surname AS created_by_surname
       FROM announcements a
       LEFT JOIN users u ON a.created_by = u.id
       ORDER BY a.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/announcements
const createAnnouncement = async (req, res) => {
  const { title, message } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO announcements (title, message, created_by) VALUES ($1, $2, $3) RETURNING *',
      [title, message, req.user.id]
    );
    res.status(201).json({ message: 'Announcement created.', announcement: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAnnouncements, createAnnouncement };
