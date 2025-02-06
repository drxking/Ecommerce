const mongoose = require("mongoose");

let collectionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, " name must be at least 2 characters long"],
        maxLength: [100, " name must be less than 100 characters"]
    },
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "type"
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }],
    thumbnailImageLink: {
        type: String,
    },
    bannerImageLink: {
        type: String,
    },
})

module.exports = mongoose.model("collect", collectionSchema);