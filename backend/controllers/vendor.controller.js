require("dotenv").config()
let { vendorModel } = require("../models/vendor.model")
const axios = require("axios");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports.addVendor = async (req, res) => {
    try {
        let { name, email, phone, address } = req.body;
        if (!name || !email || !phone || !address) {
            return res.status(400).json({
                "message": "Every Field is needed",
                "status": "failed"
            });
        }

        const file = req.file;
        if (!file) return res.status(400).json({ "message": "No file uploaded", "status": "failed" });

        console.log(file);

        // Upload to Cloudinary using upload_stream
        const uploadStream = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "vendors", use_filename: true },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                stream.end(file.buffer);
            });
        };

        const result = await uploadStream();

        console.log(result);

        let vendor = await vendorModel.create({
            name,
            imageLink: result.secure_url,
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
        res.status(500).json({
            "message": "Something Went Wrong",
            "status": "failed"
        });
        console.log(err);
    }
};

module.exports.getVendors = async (req, res) => {
    try {
        let vendors = await vendorModel.find()
        res.json({
            "message": "All vendor fetched successfully",
            "data": vendors,
            "status": "success"
        })
    } catch (err) {--
        console.log(err)
    }
}

module.exports.updateVendor = async (req, res) => {
    try {
        let { name, email, phone, address } = req.body;
        let vendor = await vendorModel.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                name,
                contactEmail: email,
                contactPhone: phone,
                address
            }
        }, { new: true })
        res.json({
            "message": "Vendor Updated Successfully",
            "data": vendor,
            "status": "success"
        })
    } catch (err) {
        console.log(err)
    }
}

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

        let imageUrl = vendor.imageLink;
        let publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(`vendors/${publicId}`);

        res.json({
            "message": `${vendor.name} deleted successfully`,
            "data": vendor,
            "status": "success"
        });
    } catch (err) {
        res.status(500).json({
            "message": "Something went wrong",
            "status": "failed"
        });
        console.log(err);
    }
};