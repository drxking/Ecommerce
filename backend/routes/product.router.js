const express = require("express");
let { getAllProducts, getProduct } = require("../controllers/product.controller")

let router = express.Router()

router.get("/", getAllProducts)

router.get("/:id",getProduct)

module.exports = router;