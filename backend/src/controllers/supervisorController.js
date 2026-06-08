const pool = require('../config/db');

// GET /api/supervisor/assigned-issues
const getAssignedIssues = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT i.*, u.name AS reporter_name, u.surname AS reporter_surname, u.contact AS reporter_contact
       FROM issues i
       JOIN users u ON i.resident_id = u.id
       WHERE i.supervisor_id = $1
       ORDER BY i.date_reported DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/supervisor/supervisors
const getAllSupervisors = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.surname, u.email, u.contact, d.name AS department
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.role_name = 'SUPERVISOR'
       ORDER BY u.name`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/supervisor/update-issue-status/:issueID
const updateIssueStatus = async (req, res) => {
  const { issueID } = req.params;
  const { status } = req.body;
  const validStatuses = ['Pending', 'In Progress', 'Completed', 'Complicated'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status.' });

  try {
    const { rows } = await pool.query(
      'UPDATE issues SET status = $1 WHERE issue_id = $2 AND supervisor_id = $3 RETURNING *',
      [status, issueID, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Issue not found or not assigned to you.' });

    // Notify the resident
    const issue = rows[0];
    await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)',
      [issue.resident_id, 'Issue Status Updated', `Your issue status has been updated to: ${status}`]
    );

    res.json({ message: 'Status updated.', issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAssignedIssues, getAllSupervisors, updateIssueStatus };
