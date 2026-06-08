const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const issueStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'service-portal/issues',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'service-portal/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const uploadIssueImage = multer({ storage: issueStorage });
const uploadProfileImage = multer({ storage: profileStorage });

module.exports = { cloudinary, uploadIssueImage, uploadProfileImage };
