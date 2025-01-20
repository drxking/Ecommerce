const productModel = require("../models/product.model")
module.exports.getAllProducts = async (req, res) => {
    let products = await productModel.aggregate([
        {
            $project: { name: 1, price: 1, imageLink: 1,views:1 }
        },
    ])
    res.json(products)
}

module.exports.getProduct = async (req, res) => {
    let product = await productModel.findOne({ _id: req.params.id }).populate("vendor")
    product.views += 1;
    product.save()
    res.json(product)
}