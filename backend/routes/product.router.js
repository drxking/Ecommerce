const express = require("express");
let { getAllProducts, getProduct, searchProduct } = require("../controllers/product.controller")

let router = express.Router()

router.get("/", getAllProducts)

router.get("/search", searchProduct)

router.get("/:id", getProduct)




module.exports = router;