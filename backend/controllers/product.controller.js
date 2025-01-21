const productModel = require("../models/product.model")
const mongoose = require("mongoose")



module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.aggregate([
            {
                $project: { name: 1, price: 1, imageLink: 1, views: 1 },
            },
        ]);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products", details: err.message });
    }
};

module.exports.getProduct = async (req, res) => {
    const { id } = req.params;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        const product = await productModel.findOne({ _id: id }).populate("vendor");

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Increment views
        product.views += 1;
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch product", details: err.message });
    }
};

module.exports.searchProduct = async (req, res) => {
    const product = req.query.product;
    let regex = new RegExp(`^${product}`, 'i')
    console.log(product)
    if (!product) {
        return res.status(400).json({ error: "Invalid product query" });
    }

    try {
        const products = await productModel.find({ "name": regex }).limit(5)
        if (products.length > 0) {
            res.json({
                "message": "Product Found",
                "status": "success",
                "data": products
            });
        }
        else {
            res.json({
                "message": "Product not Found",
                "status": "failed"
            });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to search products", details: err.message });
    }
};