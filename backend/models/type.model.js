const mongoose = require("mongoose");

let typeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, " name must be at least 2 characters long"],
        maxLength: [100, " name must be less than 100 characters"]
    },
    products:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
})

module.exports = mongoose.model("type", typeSchema);