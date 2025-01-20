const mongoose = require("mongoose");

let vendorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, " name must be at least 2 characters long"],
        maxLength: [100, " name must be less than 100 characters"]
    },
    
    imageLink:{
        type:String,
        required:true
    },

    contactEmail: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
    },

    contactPhone: {
        type: String,
        required: true,
        match: [/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"]
    },

    address: {
        type: String,
        required: true,
        maxLength: [200, "Address must be less than 200 characters"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("vendor", vendorSchema);