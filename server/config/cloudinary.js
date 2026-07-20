const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary Configuration (Fallback values added for production)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ixpovxdn',
  api_key: process.env.CLOUDINARY_API_KEY || '291781731184945',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'VRy1zHhrBRE5m2HHuV3bLPu7aKQ'
});

// Multer Cloudinary Storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zero_waste_donations', // Cloudinary me folder ka naam
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;