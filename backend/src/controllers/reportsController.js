const pool = require('../config/db');
const { sendReportEmail } = require('../utils/emailService');

// GET /api/reports?from=2024-01-01&to=2024-01-31
const getReports = async (req, res) => {
  const { from, to } = req.query;
  try {
    const { rows } = await pool.query(
      `SELECT i.*, u.name AS reporter_name, u.surname AS reporter_surname,
              s.name AS supervisor_name, s.surname AS supervisor_surname,
              d.name AS department_name
       FROM issues i
       JOIN users u ON i.resident_id = u.id
       LEFT JOIN users s ON i.supervisor_id = s.id
       LEFT JOIN departments d ON i.department_id = d.id
       WHERE ($1::date IS NULL OR i.date_reported >= $1::date)
         AND ($2::date IS NULL OR i.date_reported <= $2::date + INTERVAL '1 day')
       ORDER BY i.date_reported DESC`,
      [from || null, to || null]
    );

    const summary = {
      total: rows.length,
      pending: rows.filter(r => r.status === 'Pending').length,
      inProgress: rows.filter(r => r.status === 'In Progress').length,
      completed: rows.filter(r => r.status === 'Completed').length,
      complicated: rows.filter(r => r.status === 'Complicated').length,
    };

    res.json({ summary, issues: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/reports/submit
const submitReport = async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: 'Title and message are required.' });
  }

  try {
    // Get supervisor's full name and department
    const supRes = await pool.query(
      'SELECT name, surname, department_id FROM users WHERE id = $1',
      [req.user.id]
    );
    const supervisor = supRes.rows[0];
    const fromName = `${supervisor.name} ${supervisor.surname}`;

    // Find the manager for this department
    const managerRes = await pool.query(
      `SELECT email, name FROM users
       WHERE role_name = 'MANAGER' AND department_id = $1
       LIMIT 1`,
      [supervisor.department_id]
    );

    if (!managerRes.rows.length) {
      return res.status(404).json({ message: 'No manager found for your department. Please contact your administrator.' });
    }

    const manager = managerRes.rows[0];
    await sendReportEmail(manager.email, fromName, title, message);
    res.json({ message: `Report sent to ${manager.name} (your department manager).` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send report. Please try again.' });
  }
};

module.exports = { getReports, submitReport };
