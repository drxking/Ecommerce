const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Creates a multer diskStorage engine for a specific subfolder inside uploads/
 *
 * @param {string} subfolder Subfolder name under uploads/ (e.g. 'products', 'collections', 'vendors', 'categories', 'banners')
 */
const createDiskStorage = (subfolder) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const destPath = path.join(__dirname, '..', 'uploads', subfolder);
            fs.mkdirSync(destPath, { recursive: true });
            cb(null, destPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
    });
};

/**
 * File filter to ensure only image files are accepted.
 */
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

/**
 * File filter for banner media (supports video and image files).
 */
const mediaFileFilter = (req, file, cb) => {
    if (file.mimetype && (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/'))) {
        cb(null, true);
    } else {
        cb(new Error('Only video or image files are allowed for banner!'), false);
    }
};

const imageLimits = {
    fileSize: 10 * 1024 * 1024 // 10MB limit per image
};

const bannerLimits = {
    fileSize: 100 * 1024 * 1024 // 100MB limit for banner video/media
};

// Specialized uploaders
const uploadProduct = multer({
    storage: createDiskStorage('products'),
    fileFilter: imageFileFilter,
    limits: imageLimits
});

const uploadCollection = multer({
    storage: createDiskStorage('collections'),
    fileFilter: imageFileFilter,
    limits: imageLimits
});

const uploadVendor = multer({
    storage: createDiskStorage('vendors'),
    fileFilter: imageFileFilter,
    limits: imageLimits
});

const uploadCategory = multer({
    storage: createDiskStorage('categories'),
    fileFilter: imageFileFilter,
    limits: imageLimits
});

const uploadBanner = multer({
    storage: createDiskStorage('banners'),
    fileFilter: mediaFileFilter,
    limits: bannerLimits
});

// Generic uploader that automatically selects the folder based on request URL
const genericStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'others';
        const url = req.baseUrl || req.originalUrl || '';

        if (url.includes('vendor')) folder = 'vendors';
        else if (url.includes('collection')) folder = 'collections';
        else if (url.includes('product')) folder = 'products';
        else if (url.includes('type') || url.includes('categor')) folder = 'categories';
        else if (url.includes('banner')) folder = 'banners';

        const destPath = path.join(__dirname, '..', 'uploads', folder);
        fs.mkdirSync(destPath, { recursive: true });
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: genericStorage,
    fileFilter: mediaFileFilter,
    limits: bannerLimits
});

module.exports = {
    upload,
    uploadProduct,
    uploadCollection,
    uploadVendor,
    uploadCategory,
    uploadBanner,
    createDiskStorage
};
