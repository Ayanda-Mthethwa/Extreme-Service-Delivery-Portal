const pool = require('../config/db');

// DELETE /api/users/:email
const deleteUser = async (req, res) => {
  const { email } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM users WHERE email = $1 RETURNING id, email, role_name', [email]);
    if (!rows.length) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted.', user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { deleteUser };
