const { mongoose } = require("mongoose");
let collectionModel = require("../models/collection.model")

module.exports.addCollection = async (req, res) => {

    let { name, type, products } = req.body;
    if (!name || type?.length == 0 || products?.length == 0) {
        return res.status(400).json({
            "message": "All Fields required",
            "status": "failed"
        })
    }
    console.log(req.files.thumbnail)
    try {
        let collection = await collectionModel.create({
            name,
            type,
            products,
            thumbnailImageLink: req.files.thumbnail[0].path,
            bannerImageLink: req.files.banner[0].path
        })
        res.json({
            "message": "Added Collection",
            "status": "success",
            "data": collection
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "message": "Internal Server Error",
            "status": "failed",
            "error": err.message
        })
    }

}

module.exports.getThreeCollection = async (req, res) => {
    try {
        console.log(req)

        let collections = await collectionModel.find().limit(3)
        res.json({
            "message": "Fetched Collection",
            "status": "success",
            "data": collections
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "message": "Internal Server Error",
            "status": "failed",
            "error": err.message
        })
    }
}

module.exports.getAllCollection = async (req, res) => {
    try {
        let collections = await collectionModel.find().populate('type').populate("products")
        res.json({
            "message": "Fetched Collection",
            "status": "success",
            "data": collections
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "message": "Internal Server Error",
            "status": "failed",
            "error": err.message
        })
    }
}

module.exports.getPureCollection = async (req, res) => {
    try {
        let collections = await collectionModel.aggregate([
            { $project: { name: 1, thumbnailImageLink: 1, bannerImageLink: 1 } }
        ])
        res.json({
            "message": "Fetched need field of Collection",
            "status": "success",
            "data": collections
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "message": "Internal Server Error",
            "status": "failed",
            "error": err.message
        })
    }
}


module.exports.getOneCollection = async (req, res) => {
    let { id } = req.params
    try {
        let collection = await collectionModel.findOne({ _id: id }).populate(
            {
                path: "products",
                limit: 8
            }
        ).populate(
            {
                path: "type"
            }
        )
        if (collection) {
            res.json({
                "message": "Fetched Collection Successfully",
                "status": "success",
                "data": collection
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            "message": "Internal Server Error",
            "status": "failed",
            "error": err.message
        })
    }
}

module.exports.addProductToCollection = async (req, res) => {
    let collection = req.params.collection;
    let product = req.params.product
    try {
        let newCollection = await collectionModel.findByIdAndUpdate(
            collection,
            {
                $push: {
                    products: product
                }
            },
            { new: true, useFindAndModify: false }
        )
        console.log(newCollection)
        res.json({
            "message": "Fetched Collection Successfully",
            "status": "success",
            "data": collection
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "message": "Internal Server Error",
            "status": "failed",
            "error": err.message
        })
    }
}