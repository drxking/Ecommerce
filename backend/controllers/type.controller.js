const typeModel = require("../models/type.model");
const { getFileUrl, deleteLocalFile, cleanupUploadedFiles } = require("../utils/fileStorage");

module.exports.getSearchType = async (req, res) => {
    try {
        let query = req.query.type;
        let regex = new RegExp(`^${query}`, 'i');
        let types = await typeModel.find({ "name": regex }).limit(5);
        if (types.length > 0) {
            res.json({
                "message": "Type Found",
                "status": "success",
                "data": types
            });
        } else {
            res.json({
                "message": "Type Not Found",
                "status": "failed"
            });
        }
    } catch (err) {
        console.error("Error searching types:", err);
        res.status(500).json({
            "message": "Internal server error",
            "status": "failed"
        });
    }
};

module.exports.getAllTypes = async (req, res) => {
    try {
        let types = await typeModel.find();
        res.json({
            "message": "All Types fetched successfully",
            "status": "success",
            "data": types
        });
    } catch (err) {
        console.error("Error fetching types:", err);
        res.status(500).json({
            "message": "Internal server error",
            "status": "failed"
        });
    }
};

module.exports.addType = async (req, res) => {
    try {
        let { category, name } = req.body;
        let typeName = category || name;

        if (!typeName || typeName.trim() === '') {
            cleanupUploadedFiles(req.file);
            return res.status(400).json({
                "message": "Category name is required",
                "status": "failed"
            });
        }

        typeName = typeName.trim();
        let existingType = await typeModel.findOne({ name: typeName });
        if (existingType) {
            cleanupUploadedFiles(req.file);
            return res.json({
                "message": "Type Already Exists",
                "status": "failed",
                "data": existingType
            });
        }

        let imageLink = undefined;
        if (req.file) {
            imageLink = getFileUrl(req, `/uploads/categories/${req.file.filename}`);
        }

        let type = await typeModel.create({
            name: typeName,
            ...(imageLink && { imageLink })
        });

        res.json({
            "message": "Type Created Successfully",
            "status": "success",
            "data": type
        });

    } catch (err) {
        cleanupUploadedFiles(req.file);
        console.error("Error adding type:", err);
        res.status(500).json({
            "message": "Internal server error",
            "status": "failed"
        });
    }
};

module.exports.deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        const type = await typeModel.findByIdAndDelete(id);

        if (!type) {
            return res.status(404).json({
                "message": "Type not found",
                "status": "failed"
            });
        }

        if (type.imageLink) {
            deleteLocalFile(type.imageLink);
        }

        res.json({
            "message": "Type deleted successfully",
            "status": "success",
            "data": type
        });
    } catch (err) {
        console.error("Error deleting type:", err);
        res.status(500).json({
            "message": "Internal server error",
            "status": "failed"
        });
    }
};