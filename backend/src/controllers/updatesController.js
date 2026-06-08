const pool = require('../config/db');

// PUT /api/updates/update-profile-picture/:userID
const updateProfilePicture = async (req, res) => {
  const { userID } = req.params;
  const imageUrl = req.file?.path;
  if (!imageUrl) return res.status(400).json({ message: 'No image uploaded.' });

  try {
    const { rows } = await pool.query(
      'UPDATE users SET profile_pic = $1, updated_at = NOW() WHERE id = $2 RETURNING id, profile_pic',
      [imageUrl, userID]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'Profile picture updated.', profilePic: rows[0].profile_pic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/updates/update-details/:userID
const updateDetails = async (req, res) => {
  const { userID } = req.params;
  const { name, surname, email, contact, address } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE users SET name = COALESCE($1, name), surname = COALESCE($2, surname),
       email = COALESCE($3, email), contact = COALESCE($4, contact),
       address = COALESCE($5, address), updated_at = NOW()
       WHERE id = $6
       RETURNING id, name, surname, email, contact, address, profile_pic, role_name`,
      [name, surname, email, contact, address, userID]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'Profile updated.', user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/updates/departments
const getDepartments = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM departments ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/updates/municipal-emps
const getMunicipalEmployees = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.surname, u.email, u.contact, u.role_name, u.created_at, d.name AS department
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.role_name IN ('SUPERVISOR', 'MANAGER', 'ADMIN')
       ORDER BY u.role_name, u.name`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { updateProfilePicture, updateDetails, getDepartments, getMunicipalEmployees };
