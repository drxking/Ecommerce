const homeConfigModel = require("../models/homeConfig.model");
const collectionModel = require("../models/collection.model");
const mongoose = require("mongoose");
const { storeFile, deleteStoredFile, cleanupUploadedFiles } = require("../utils/fileStorage");
const { getCloudinary, isCloudinaryStorage } = require("../config/cloudinary");

// Helper to format config so orderedCollections always has a .collection field for frontend
const formatConfig = (config) => {
    if (!config) return null;
    const obj = config.toObject ? config.toObject() : { ...config };
    if (obj.banner) {
        obj.banner.mediaLink = obj.banner.mediaLink || obj.banner.videoLink || "/hero.webm";
        obj.banner.mediaType = obj.banner.mediaType || (obj.banner.mediaLink.match(/\.(mp4|webm|mov|m4v)$/i) ? "video" : "image");
    }
    if (obj.orderedCollections && Array.isArray(obj.orderedCollections)) {
        obj.orderedCollections = obj.orderedCollections.map((item) => ({
            ...item,
            collection: item.collect || item.collection
        }));
    }
    return obj;
};

// Helper to get or initialize home config
const getOrCreateConfig = async () => {
    let config = await homeConfigModel.findOne()
        .populate("orderedCollections.collect")
        .populate("topThreeCollections");

    if (!config) {
        config = await homeConfigModel.create({
            banner: {
                title: "",
                videoLink: "/hero.webm",
                mediaLink: "/hero.webm",
                mediaType: "video",
                redirectLink: "/"
            },
            orderedCollections: [],
            topThreeCollections: []
        });
    }

    return config;
};

module.exports.getHomeConfig = async (req, res) => {
    try {
        const config = await getOrCreateConfig();
        res.json({
            status: "success",
            data: formatConfig(config)
        });
    } catch (err) {
        console.error("Error fetching home config:", err);
        res.status(500).json({
            status: "failed",
            message: "Failed to fetch home configuration",
            error: err.message
        });
    }
};

// Lets an authenticated admin upload banner media directly to Cloudinary. The
// signature is short-lived and does not expose the Cloudinary API secret.
module.exports.getBannerUploadSignature = (req, res) => {
    if (!isCloudinaryStorage()) {
        return res.json({ status: "success", provider: "local" });
    }

    try {
        const cloudinary = getCloudinary();
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = "ecommerce/banners";
        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder },
            process.env.CLOUDINARY_API_SECRET
        );

        return res.json({
            status: "success",
            provider: "cloudinary",
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            timestamp,
            folder,
            signature,
        });
    } catch (err) {
        return res.status(500).json({ status: "failed", message: err.message });
    }
};

module.exports.updateBanner = async (req, res) => {
    try {
        let config = await homeConfigModel.findOne();
        if (!config) {
            config = new homeConfigModel();
        }

        const { title, redirectLink, mediaUrl, mediaType: requestedMediaType } = req.body;

        if (title !== undefined) {
            config.banner.title = title;
        }

        if (redirectLink !== undefined) {
            config.banner.redirectLink = redirectLink;
        }

        let mediaLink;
        let mediaType;
        if (req.file) {
            mediaType = req.file.mimetype?.startsWith("video/") ? "video" : "image";
            mediaLink = await storeFile(req, req.file, "banners");
        } else if (mediaUrl) {
            if (!isCloudinaryStorage()) {
                return res.status(400).json({ status: "failed", message: "Direct media URLs require Cloudinary storage" });
            }

            const url = new URL(mediaUrl);
            const expectedPath = `/${process.env.CLOUDINARY_CLOUD_NAME}/`;
            if (url.hostname !== "res.cloudinary.com" || !url.pathname.startsWith(expectedPath)) {
                return res.status(400).json({ status: "failed", message: "Invalid Cloudinary media URL" });
            }

            mediaType = requestedMediaType === "image" ? "image" : "video";
            mediaLink = mediaUrl;
        }

        if (mediaLink) {
            const oldMedia = config.banner.mediaLink || config.banner.videoLink;
            config.banner.mediaLink = mediaLink;
            config.banner.mediaType = mediaType;
            // Keep the legacy field populated for clients that still read it.
            config.banner.videoLink = mediaLink;

            if (oldMedia) await deleteStoredFile(oldMedia);
        }

        await config.save();

        res.json({
            status: "success",
            message: "Banner updated successfully",
            data: formatConfig(config).banner
        });
    } catch (err) {
        cleanupUploadedFiles(req.file);
        console.error("Error updating banner:", err);
        res.status(500).json({
            status: "failed",
            message: "Failed to update banner",
            error: err.message
        });
    }
};

module.exports.updateOrderedCollections = async (req, res) => {
    try {
        let config = await homeConfigModel.findOne();
        if (!config) {
            config = new homeConfigModel();
        }

        const { collections } = req.body;
        if (!Array.isArray(collections)) {
            return res.status(400).json({
                status: "failed",
                message: "collections must be an array"
            });
        }

        const formatted = [];
        for (let i = 0; i < collections.length; i++) {
            const item = collections[i];
            const colId = typeof item === 'object' && item !== null
                ? (item.collection || item.collect || item._id || item.collectionId)
                : item;
            const orderNum = typeof item === 'object' && item !== null && item.order !== undefined
                ? Number(item.order)
                : i + 1;

            if (colId && mongoose.Types.ObjectId.isValid(colId)) {
                formatted.push({
                    collect: colId,
                    order: orderNum
                });
            }
        }

        formatted.sort((a, b) => a.order - b.order);

        config.orderedCollections = formatted;
        await config.save();
        await config.populate("orderedCollections.collect");

        res.json({
            status: "success",
            message: "Ordered collections updated successfully",
            data: formatConfig(config).orderedCollections
        });
    } catch (err) {
        console.error("Error updating ordered collections:", err);
        res.status(500).json({
            status: "failed",
            message: "Failed to update ordered collections",
            error: err.message
        });
    }
};

module.exports.updateTopThreeCollections = async (req, res) => {
    try {
        let config = await homeConfigModel.findOne();
        if (!config) {
            config = new homeConfigModel();
        }

        const { collectionIds } = req.body;
        if (!Array.isArray(collectionIds)) {
            return res.status(400).json({
                status: "failed",
                message: "collectionIds must be an array"
            });
        }

        if (collectionIds.length > 3) {
            return res.status(400).json({
                status: "failed",
                message: "Top three collections can have at most 3 collections"
            });
        }

        const validIds = collectionIds.filter(id => id && mongoose.Types.ObjectId.isValid(id));

        config.topThreeCollections = validIds;
        await config.save();
        await config.populate("topThreeCollections");

        res.json({
            status: "success",
            message: "Top three collections updated successfully",
            data: config.topThreeCollections
        });
    } catch (err) {
        console.error("Error updating top three collections:", err);
        res.status(500).json({
            status: "failed",
            message: "Failed to update top three collections",
            error: err.message
        });
    }
};
