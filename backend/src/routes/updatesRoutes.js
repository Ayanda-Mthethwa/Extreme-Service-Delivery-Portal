const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { uploadProfileImage } = require('../config/cloudinary');
const { updateProfilePicture, updateDetails, getDepartments, getMunicipalEmployees } = require('../controllers/updatesController');

router.put('/update-profile-picture/:userID', verifyToken, uploadProfileImage.single('profilePic'), updateProfilePicture);
router.put('/update-details/:userID', verifyToken, updateDetails);
router.get('/departments', getDepartments);
router.get('/municipal-emps', verifyToken, getMunicipalEmployees);

module.exports = router;
