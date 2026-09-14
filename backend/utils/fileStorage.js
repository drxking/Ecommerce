const fs = require('fs');
const path = require('path');

/**
 * Returns the full accessible URL for a stored file.
 * e.g. "http://localhost:3000/uploads/products/image-123.png"
 *
 * @param {import('express').Request} req
 * @param {string} relativePath e.g. "/uploads/products/file.jpg"
 * @returns {string}
 */
const getFileUrl = (req, relativePath) => {
    if (!relativePath) return '';
    const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    const baseUrl = process.env.SERVER_URL || "https://t-sabinz.onrender.com" || (req ? `${req.protocol}://${req.get('host')}` : '');
    return `${baseUrl}${cleanPath}`;
};

/**
 * Deletes a local file if it exists in the uploads directory.
 * Safe to call with full URLs, relative paths, or legacy Cloudinary URLs.
 *
 * @param {string} fileUrlOrPath
 */
const deleteLocalFile = (fileUrlOrPath) => {
    if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') return;

    try {
        let relativePath = fileUrlOrPath;

        // If it's a full URL containing /uploads/
        if (fileUrlOrPath.includes('/uploads/')) {
            relativePath = fileUrlOrPath.substring(fileUrlOrPath.indexOf('/uploads/'));
        }

        // Only delete if it points to local /uploads/
        if (relativePath.startsWith('/uploads/')) {
            const subPath = relativePath.replace('/uploads/', '');
            const absolutePath = path.join(__dirname, '..', 'uploads', subPath);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log(`Successfully deleted local file: ${absolutePath}`);
            }
        }
    } catch (err) {
        console.error(`Failed to delete local file "${fileUrlOrPath}":`, err.message);
    }
};

/**
 * Cleans up any uploaded files from disk if an error occurs during request processing.
 *
 * @param {object|Array} files req.file or req.files
 */
const cleanupUploadedFiles = (files) => {
    if (!files) return;

    try {
        if (files.path) {
            // Single file (req.file)
            if (fs.existsSync(files.path)) {
                fs.unlinkSync(files.path);
            }
            return;
        }

        if (Array.isArray(files)) {
            files.forEach(f => {
                if (f?.path && fs.existsSync(f.path)) {
                    fs.unlinkSync(f.path);
                }
            });
            return;
        }

        if (typeof files === 'object') {
            Object.values(files).forEach(fileOrArray => {
                if (Array.isArray(fileOrArray)) {
                    fileOrArray.forEach(f => {
                        if (f?.path && fs.existsSync(f.path)) {
                            fs.unlinkSync(f.path);
                        }
                    });
                } else if (fileOrArray?.path && fs.existsSync(fileOrArray.path)) {
                    fs.unlinkSync(fileOrArray.path);
                }
            });
        }
    } catch (err) {
        console.error('Error cleaning up uploaded files:', err.message);
    }
};

module.exports = {
    getFileUrl,
    deleteLocalFile,
    cleanupUploadedFiles
};
