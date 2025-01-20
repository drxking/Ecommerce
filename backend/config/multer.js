const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure CloudinaryStorage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ecommerce', // Change folder name as needed
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif']// Optional image transformation
    }
});

// Configure Multer
const upload = multer({
    storage
});

module.exports.upload = upload;
module.exports.cloudinary = cloudinary;
