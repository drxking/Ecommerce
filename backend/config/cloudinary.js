const { v2: cloudinary } = require("cloudinary");

const isCloudinaryStorage = () =>
    (process.env.STORAGE_PROVIDER || "local").trim().toLowerCase() === "cloudinary";

const getCloudinary = () => {
    if (!isCloudinaryStorage()) return null;

    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new Error(
            "Cloudinary storage requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET"
        );
    }

    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        secure: true,
    });

    return cloudinary;
};

module.exports = { getCloudinary, isCloudinaryStorage };
