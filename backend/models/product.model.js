const mongoose = require("mongoose");

let productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, " name must be at least 2 characters long"],
        maxLength: [100, " name must be less than 100 characters"]
    },
    description: {
        type: String,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor"
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "type"
    },
    collect: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "collect"
    },
    price: {
        type: Number,
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    otherImageLink: [
        {
            type: String
        }
    ],
    size: [
        {
            type: String
        }
    ]
})

module.exports = mongoose.model("product", productSchema);