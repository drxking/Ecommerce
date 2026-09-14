const homeConfigModel = require("../models/homeConfig.model");
const collectionModel = require("../models/collection.model");
const mongoose = require("mongoose");
const { getFileUrl, deleteLocalFile, cleanupUploadedFiles } = require("../utils/fileStorage");

// Helper to format config so orderedCollections always has a .collection field for frontend
const formatConfig = (config) => {
    if (!config) return null;
    const obj = config.toObject ? config.toObject() : { ...config };
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

module.exports.updateBanner = async (req, res) => {
    try {
        let config = await homeConfigModel.findOne();
        if (!config) {
            config = new homeConfigModel();
        }

        const { title, redirectLink } = req.body;

        if (title !== undefined) {
            config.banner.title = title;
        }

        if (redirectLink !== undefined) {
            config.banner.redirectLink = redirectLink;
        }

        if (req.file) {
            const oldVideo = config.banner.videoLink;
            config.banner.videoLink = getFileUrl(req, `/uploads/banners/${req.file.filename}`);

            if (oldVideo && oldVideo.includes("/uploads/banners/")) {
                deleteLocalFile(oldVideo);
            }
        }

        await config.save();

        res.json({
            status: "success",
            message: "Banner updated successfully",
            data: config.banner
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
