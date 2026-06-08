const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getAssignedIssues, getAllSupervisors, updateIssueStatus } = require('../controllers/supervisorController');

router.get('/assigned-issues', verifyToken, requireRole('SUPERVISOR'), getAssignedIssues);
router.get('/supervisors', verifyToken, getAllSupervisors);
router.put('/update-issue-status/:issueID', verifyToken, requireRole('SUPERVISOR'), updateIssueStatus);

module.exports = router;
