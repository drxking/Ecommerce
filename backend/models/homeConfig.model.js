const mongoose = require("mongoose");

const homeConfigSchema = mongoose.Schema({
    banner: {
        title: {
            type: String,
            default: ""
        },
        videoLink: {
            type: String,
            default: ""
        },
        // `videoLink` is retained for existing clients and records. New code
        // reads mediaLink/mediaType, which support either a banner image or video.
        mediaLink: {
            type: String,
            default: ""
        },
        mediaType: {
            type: String,
            enum: ["image", "video"],
            default: "video"
        },
        redirectLink: {
            type: String,
            default: "/"
        }
    },
    orderedCollections: [{
        collect: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "collect",
            required: true
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    topThreeCollections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "collect"
    }],
    featuredProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("homeConfig", homeConfigSchema);
