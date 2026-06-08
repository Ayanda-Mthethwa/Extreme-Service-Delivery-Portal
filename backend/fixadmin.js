require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./src/config/db');

async function fix() {
  const hash = await bcrypt.hash('admin123', 10);
  await pool.query("UPDATE users SET password_hash = $1 WHERE email = 'ayoh45thabany@gmail.com'", [hash]);
  console.log('Password updated successfully. You can now log in with: admin123');
  process.exit(0);
}

fix().catch(err => { console.error(err); process.exit(1); });
