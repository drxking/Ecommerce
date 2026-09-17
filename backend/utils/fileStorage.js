const fs = require('fs');
const path = require('path');
const { getCloudinary, isCloudinaryStorage } = require('../config/cloudinary');
require('dotenv').config()

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
    const baseUrl = process.env.SERVER_URL  || (req ? `${req.protocol}://${req.get('host')}` : '');
    return `${baseUrl}${cleanPath}`;
};

/**
 * Stores a multer file using the configured provider and returns its public URL.
 * Cloudinary mode accepts either a Multer memory buffer (serverless-safe) or
 * a temporary local file (traditional server runtime).
 */
const storeFile = async (req, file, folder) => {
    if (!file) throw new Error('No file supplied for storage');

    if (!isCloudinaryStorage()) {
        return getFileUrl(req, `/uploads/${folder}/${file.filename}`);
    }

    const cloudinary = getCloudinary();
    const resourceType = file.mimetype?.startsWith('video/') ? 'video' : 'image';
    const options = {
        folder: `ecommerce/${folder}`,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
    };
    const result = file.buffer
        ? await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(options, (error, uploaded) => {
                if (error) reject(error);
                else resolve(uploaded);
            });
            stream.end(file.buffer);
        })
        : await cloudinary.uploader.upload(file.path, options);

    // The source is only a temporary staging file in Cloudinary mode.
    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return result.secure_url;
};

const getCloudinaryPublicId = (fileUrl) => {
    try {
        const url = new URL(fileUrl);
        if (!url.hostname.endsWith('cloudinary.com')) return null;
        const match = url.pathname.match(/\/(?:image|video|raw)\/upload\/(?:v\d+\/)?(.+)$/);
        if (!match) return null;
        return decodeURIComponent(match[1]).replace(/\.[^/.]+$/, '');
    } catch {
        return null;
    }
};

/** Deletes either a legacy/local upload or a Cloudinary asset. */
const deleteStoredFile = async (fileUrlOrPath) => {
    if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') return;

    const publicId = getCloudinaryPublicId(fileUrlOrPath);
    if (publicId) {
        const cloudinary = getCloudinary();
        const resourceType = fileUrlOrPath.includes('/video/upload/') ? 'video' : 'image';
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return;
    }

    deleteLocalFile(fileUrlOrPath);
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
    storeFile,
    deleteLocalFile,
    deleteStoredFile,
    cleanupUploadedFiles
};
