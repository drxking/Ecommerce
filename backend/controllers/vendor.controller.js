require("dotenv").config();
let { vendorModel } = require("../models/vendor.model");
const { storeFile, deleteStoredFile, cleanupUploadedFiles } = require("../utils/fileStorage");

module.exports.addVendor = async (req, res) => {
    try {
        let { name, email, phone, address } = req.body;
        if (!name || !email || !phone || !address) {
            cleanupUploadedFiles(req.file);
            return res.status(400).json({
                "message": "Every Field is needed",
                "status": "failed"
            });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ "message": "No file uploaded", "status": "failed" });
        }

        const imageLink = await storeFile(req, file, "vendors");

        let vendor = await vendorModel.create({
            name,
            imageLink,
            contactEmail: email,
            contactPhone: phone,
            address
        });

        res.json({
            "message": "Vendor Added Successfully",
            "data": vendor,
            "status": "success"
        });
    } catch (err) {
        cleanupUploadedFiles(req.file);
        console.error("Error adding vendor:", err);
        res.status(500).json({
            "message": "Something Went Wrong",
            "status": "failed",
            "error": err.message
        });
    }
};

module.exports.getVendors = async (req, res) => {
    try {
        let vendors = await vendorModel.find();
        res.json({
            "message": "All vendor fetched successfully",
            "data": vendors,
            "status": "success"
        });
    } catch (err) {
        console.error("Error fetching vendors:", err);
        res.status(500).json({
            "message": "Failed to fetch vendors",
            "status": "failed"
        });
    }
};

module.exports.updateVendor = async (req, res) => {
    try {
        let { name, email, phone, address } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (email) updateData.contactEmail = email;
        if (phone) updateData.contactPhone = phone;
        if (address) updateData.address = address;

        if (req.file) {
            updateData.imageLink = await storeFile(req, req.file, "vendors");
        }

        const oldVendor = await vendorModel.findById(req.params.id);
        if (!oldVendor) {
            cleanupUploadedFiles(req.file);
            return res.status(404).json({
                "message": "Vendor not found",
                "status": "failed"
            });
        }

        let vendor = await vendorModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        // If new image was uploaded, delete the old image
        if (req.file && oldVendor.imageLink) {
            await deleteStoredFile(oldVendor.imageLink);
        }

        res.json({
            "message": "Vendor Updated Successfully",
            "data": vendor,
            "status": "success"
        });
    } catch (err) {
        cleanupUploadedFiles(req.file);
        console.error("Error updating vendor:", err);
        res.status(500).json({
            "message": "Something went wrong",
            "status": "failed"
        });
    }
};

module.exports.deleteVendor = async (req, res) => {
    try {
        let vendor = await vendorModel.findOneAndDelete({
            _id: req.params.id
        });

        if (!vendor) {
            return res.status(404).json({
                "message": "Vendor not found",
                "status": "failed"
            });
        }

        // Delete from local storage
        if (vendor.imageLink) {
            await deleteStoredFile(vendor.imageLink);
        }

        res.json({
            "message": `${vendor.name} deleted successfully`,
            "data": vendor,
            "status": "success"
        });
    } catch (err) {
        console.error("Error deleting vendor:", err);
        res.status(500).json({
            "message": "Something went wrong",
            "status": "failed"
        });
    }
};
