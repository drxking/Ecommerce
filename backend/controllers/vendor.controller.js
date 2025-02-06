require("dotenv").config()
let generateRandomString = require("../utils/randomNameGenerator")
let { vendorModel } = require("../models/vendor.model")
const fs = require("fs");
const axios = require("axios");

const STORAGE_ZONE = process.env.STORAGE_ZONE;
const API_KEY = process.env.API_KEY;
const CDN_URL = process.env.CDN_URL; 
const HOSTNAME = process.env.HOSTNAME;

module.exports.addVendor = async (req, res) => {
    try {
        let { name, email, phone, address } = req.body;
        if (!name || !email || !phone || !address) {
            return res.status(400).json({
                "message": "Every Field is needed",
                "status": "failed"
            })
        }
        let generatedName = generateRandomString();
        const file = req.file;
        if (!file) return res.status(400).json({ "message": "No file uploaded", "status": "failed" });
        const uploadUrl = `https://${HOSTNAME}/${STORAGE_ZONE}/vendors/${generatedName}.${file.originalname.split('.').pop()}`;

        // Upload to BunnyCDN-
        await axios.put(uploadUrl, file.buffer, {
            headers: {
                AccessKey: API_KEY,
                "Content-Type": "application/octet-stream",
            },
        });


        let vendor = await vendorModel.create({
            name,
            imageLink: `${CDN_URL}/vendors/${generatedName}.${file.originalname.split('.').pop()}`,
            contactEmail: email,
            contactPhone: phone,
            address
        })
        res.json({
            "message": "Vendor Added Successfully",
            "data": vendor,
            "status": "success"
        })
    } catch (err) {
        res.status(500).json({
            "message": "Something Went Wrong",
            "status": "failed"
        })
        console.log(err)
    }
}

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
        })
        let imageUrl = vendor.imageLink;
        let pathParts = imageUrl.split('/').pop()

        // Delete from BunnyCDN
        await axios.delete(`https://${HOSTNAME}/${STORAGE_ZONE}/vendors/${pathParts}`, {
            headers: {
                AccessKey: API_KEY,
            }
        });

        res.json({
            "message": `${vendor.name} deleted successfully`,
            "data": vendor,
            "status": "success"
        })
    } catch (err) {
        console.log(err)
    }
}