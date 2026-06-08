const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { uploadIssueImage } = require('../config/cloudinary');
const {
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
} = require('../controllers/issueController');

router.post('/report-issue', verifyToken, requireRole('RESIDENT'), uploadIssueImage.single('photo'), reportIssue);
router.post('/check-duplicate', checkDuplicate);
router.get('/my-issues', verifyToken, requireRole('RESIDENT'), getMyIssues);
router.get('/getAllIssues', verifyToken, getAllIssues);
router.get('/dept-issues', verifyToken, requireRole('MANAGER'), getDeptIssues);
router.get('/issue-counts', verifyToken, requireRole('ADMIN', 'MANAGER'), getIssueCounts);
router.get('/getAssignedSupervisors', verifyToken, requireRole('MANAGER', 'ADMIN'), getAssignedSupervisors);
router.get('/getIssuesAssignedToSupervisors/:supervisorID', verifyToken, getIssuesBySupervisor);
router.get('/get-issue-reporter/:residentID', verifyToken, getIssueReporter);
router.post('/assign-supervisor', verifyToken, requireRole('MANAGER'), assignSupervisor);

module.exports = router;
