const mongoose = require("mongoose");

let collectionSchema = mongoose.Schema({
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "type"
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    paymentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"payment"
    }
}, { timestamps: true })

module.exports = mongoose.model("collection", collectionSchema);