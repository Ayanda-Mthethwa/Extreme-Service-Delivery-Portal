const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  login,
  verifyOtp,
  resendOtp,
  registerResident,
  registerMunicipalEmployee,
  registerAdmin,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

router.post('/login', login);
router.post('/verify-otp/:email', verifyOtp);
router.post('/resend-otp/:email', resendOtp);
router.post('/register/resident', registerResident);
router.post('/register/municipal-employer', verifyToken, requireRole('ADMIN'), registerMunicipalEmployee);
router.post('/register/admin', verifyToken, requireRole('ADMIN'), registerAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
