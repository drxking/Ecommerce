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
    try {
        let collection = await collectionModel.create({
            name,
            type,
            products
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

module.exports.getCollectionWithPopulatedTypeAndProduct = async (req, res) => {
    try {
        let collections = await collectionModel.find().populate({
            path: 'type',
            options: { limit: 3 }
        }).populate({
            path: 'products',
            options: { limit: 2 }
        })
        res.json({
            "message": "Fetched Collection with Populated Type and Product",
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