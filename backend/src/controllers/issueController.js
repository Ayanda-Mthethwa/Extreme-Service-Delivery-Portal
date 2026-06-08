const pool = require('../config/db');

// POST /api/issue/report-issue  (multipart/form-data, image via Cloudinary middleware)
const reportIssue = async (req, res) => {
  const { issueCategory, description, location } = req.body;
  const residentId = req.user.id;
  const imageUrl = req.file?.path || null;

  try {
    // Map category to department
    const categoryDeptMap = { water: 'Water', electricity: 'Electricity', road: 'Roads', crime: 'Safety', other: 'General' };
    const deptName = categoryDeptMap[issueCategory] || 'General';
    const deptRes = await pool.query('SELECT id FROM departments WHERE LOWER(name) = LOWER($1)', [deptName]);
    const departmentId = deptRes.rows[0]?.id || null;

    const { rows } = await pool.query(
      `INSERT INTO issues (resident_id, description, issue_category, location, issue_image_path, department_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [residentId, description, issueCategory, location, imageUrl, departmentId]
    );
    res.status(201).json({ message: 'Issue reported successfully.', issue: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/issue/check-duplicate
const checkDuplicate = async (req, res) => {
  const { description, location, issueCategory } = req.body;
  try {
    const { rows } = await pool.query(
      `SELECT issue_id, description, location, status FROM issues
       WHERE issue_category = $1
       AND status NOT IN ('Completed')
       AND date_reported > NOW() - INTERVAL '7 days'
       LIMIT 5`,
      [issueCategory]
    );
    const isDuplicate = rows.length > 0;
    res.json({ isDuplicate, duplicates: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/issue/my-issues
const getMyIssues = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM issues WHERE resident_id = $1 ORDER BY date_reported DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/issue/getAllIssues  (optional ?status=&category=&from=&to=)
const getAllIssues = async (req, res) => {
  const { status, category, from, to } = req.query;
  const conditions = [];
  const values = [];
  let idx = 1;

  if (status) { conditions.push(`i.status = $${idx++}`); values.push(status); }
  if (category) { conditions.push(`i.issue_category = $${idx++}`); values.push(category); }
  if (from) { conditions.push(`i.date_reported >= $${idx++}`); values.push(from); }
  if (to) { conditions.push(`i.date_reported <= $${idx++}`); values.push(to); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const { rows } = await pool.query(
      `SELECT i.*, u.name AS reporter_name, u.surname AS reporter_surname,
              d.name AS department_name
       FROM issues i
       JOIN users u ON i.resident_id = u.id
       LEFT JOIN departments d ON i.department_id = d.id
       ${where}
       ORDER BY i.date_reported DESC`,
      values
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/issue/dept-issues  (manager's department)
const getDeptIssues = async (req, res) => {
  const { department_id } = req.user;
  try {
    const { rows } = await pool.query(
      `SELECT i.*, u.name AS reporter_name, u.surname AS reporter_surname
       FROM issues i
       JOIN users u ON i.resident_id = u.id
       WHERE i.department_id = $1
       ORDER BY i.date_reported DESC`,
      [department_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/issue/issue-counts  (monthly stats for admin/manager)
const getIssueCounts = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         TO_CHAR(date_reported, 'YYYY-MM') AS month,
         issue_category,
         status,
         COUNT(*) AS count
       FROM issues
       WHERE date_reported >= NOW() - INTERVAL '12 months'
       GROUP BY month, issue_category, status
       ORDER BY month DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/issue/getAssignedSupervisors
const getAssignedSupervisors = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.surname, u.email, d.name AS department,
              COUNT(i.issue_id) AS assigned_count
       FROM users u
       LEFT JOIN issues i ON i.supervisor_id = u.id AND i.status NOT IN ('Completed')
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.role_name = 'SUPERVISOR'
       GROUP BY u.id, u.name, u.surname, u.email, d.name`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/issue/getIssuesAssignedToSupervisors/:supervisorID
const getIssuesBySupervisor = async (req, res) => {
  const { supervisorID } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM issues WHERE supervisor_id = $1 ORDER BY date_reported DESC',
      [supervisorID]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/issue/get-issue-reporter/:residentID
const getIssueReporter = async (req, res) => {
  const { residentID } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT id, name, surname, email, contact, address, profile_pic FROM users WHERE id = $1',
      [residentID]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/issue/assign-supervisor
const assignSupervisor = async (req, res) => {
  const { issueId, supervisorId } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE issues SET supervisor_id = $1, status = 'In Progress'
       WHERE issue_id = $2 RETURNING *`,
      [supervisorId, issueId]
    );
    if (!rows.length) return res.status(404).json({ message: 'Issue not found.' });

    // Notify supervisor
    const desc = (rows[0].description || 'No description provided').substring(0, 60);
    await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)',
      [supervisorId, 'New Issue Assigned', `You have been assigned a new issue: "${desc}"`]
    );

    res.json({ message: 'Supervisor assigned.', issue: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  reportIssue,
  checkDuplicate,
  getMyIssues,
  getAllIssues,
  getDeptIssues,
  getIssueCounts,
  getAssignedSupervisors,
  getIssuesBySupervisor,
  getIssueReporter,
  assignSupervisor,
};
