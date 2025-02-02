let {vendorModel} = require("../models/vendor.model")
let {cloudinary} = require("../config/multer")
module.exports.addVendor = async (req, res) => {
    try {
        let { name, email, phone, address } = req.body;
        if (!name || !email || !phone || !address) {
            return res.status(400).json({
                "message": "Every Field is needed",
                "status": "failed"
            })
        }
        let vendor = await vendorModel.create({
            name,
            imageLink: req.file.path,
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
    } catch (err) {
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

module.exports.deleteVendor = async (req,res)=>{
    try{
        let vendor = await vendorModel.findOneAndDelete({
            _id:req.params.id
        })
        let imageUrl = vendor.imageLink;
        let pathParts = imageUrl.split('/').slice(-2);
        let public_id = pathParts[0] + '/' + pathParts[1].split(".")[0];
        await cloudinary.uploader.destroy(public_id)
        res.json({
            "message":`${vendor.name} deleted successfully`,
            "data":vendor,
            "status":"success"
        })
    }catch(err){
        console.log(err)
    }
}