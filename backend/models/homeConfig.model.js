const mongoose = require("mongoose");

const homeConfigSchema = mongoose.Schema({
    banner: {
        title: {
            type: String,
            default: ""
        },
        videoLink: {
            type: String,
            default: "/hero.webm"
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
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("homeConfig", homeConfigSchema);
