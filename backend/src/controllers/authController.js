const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const { sendOtpEmail, sendPasswordResetEmail, sendEmployeeAccountEmail } = require('../utils/emailService');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password.' });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query('DELETE FROM otps WHERE email = $1', [email]);
    await pool.query('INSERT INTO otps (email, otp_code, expires_at) VALUES ($1, $2, $3)', [email, otp, expiresAt]);

    await sendOtpEmail(email, otp);

    const masked = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
    res.json({ message: 'OTP sent to your email.', emailSent: true, email, maskedEmail: masked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/auth/verify-otp/:email
const verifyOtp = async (req, res) => {
  const { email } = req.params;
  const { otp } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM otps WHERE email = $1 AND otp_code = $2 AND expires_at > NOW()',
      [email, otp]
    );
    if (!rows.length) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    await pool.query('DELETE FROM otps WHERE email = $1', [email]);

    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role_name: user.role_name, department_id: user.department_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser, role: user.role_name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/auth/resend-otp/:email
const resendOtp = async (req, res) => {
  const { email } = req.params;
  try {
    const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!userRes.rows.length) return res.status(404).json({ message: 'User not found.' });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query('DELETE FROM otps WHERE email = $1', [email]);
    await pool.query('INSERT INTO otps (email, otp_code, expires_at) VALUES ($1, $2, $3)', [email, otp, expiresAt]);
    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP resent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/auth/register/resident
const registerResident = async (req, res) => {
  const { name, surname, email, contact, address, password } = req.body;
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) return res.status(409).json({ message: 'Email already registered.' });

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, surname, email, contact, address, password_hash, role_name)
       VALUES ($1, $2, $3, $4, $5, $6, 'RESIDENT') RETURNING id, name, surname, email, role_name`,
      [name, surname, email, contact, address, password_hash]
    );
    res.status(201).json({ message: 'Resident registered successfully.', user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/auth/register/municipal-employer  (admin only)
const registerMunicipalEmployee = async (req, res) => {
  const { name, surname, email, contact, address, password, department, role } = req.body;
  const validRoles = ['SUPERVISOR', 'MANAGER'];
  if (!validRoles.includes(role)) return res.status(400).json({ message: 'Invalid role.' });

  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) return res.status(409).json({ message: 'Email already registered.' });

    let deptId = null;
    if (department) {
      const deptRes = await pool.query('SELECT id FROM departments WHERE LOWER(name) = LOWER($1)', [department]);
      deptId = deptRes.rows[0]?.id || null;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, surname, email, contact, address, password_hash, role_name, department_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, surname, email, role_name`,
      [name, surname, email, contact, address, password_hash, role, deptId]
    );

    await sendEmployeeAccountEmail(email, name, password, role);
    res.status(201).json({ message: 'Employee account created.', user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/auth/register/admin  (admin only)
const registerAdmin = async (req, res) => {
  const { name, surname, email, contact, address, password } = req.body;
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) return res.status(409).json({ message: 'Email already registered.' });

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, surname, email, contact, address, password_hash, role_name)
       VALUES ($1, $2, $3, $4, $5, $6, 'ADMIN') RETURNING id, name, surname, email, role_name`,
      [name, surname, email, contact, address, password_hash]
    );

    await sendEmployeeAccountEmail(email, name, password, 'ADMIN');
    res.status(201).json({ message: 'Admin account created.', user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!rows.length) return res.status(404).json({ message: 'No account found with that email.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [rows[0].id]);
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [rows[0].id, token, expiresAt]
    );

    const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${token}`;
    await sendPasswordResetEmail(email, resetLink);

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    if (!rows.length) return res.status(400).json({ message: 'Invalid or expired reset token.' });

    const password_hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [password_hash, rows[0].user_id]);
    await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);

    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  login,
  verifyOtp,
  resendOtp,
  registerResident,
  registerMunicipalEmployee,
  registerAdmin,
  forgotPassword,
  resetPassword,
};
