const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { deleteUser } = require('../controllers/usersController');

router.delete('/:email', verifyToken, requireRole('ADMIN'), deleteUser);

module.exports = router;
