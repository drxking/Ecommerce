const express = require("express");
const {
    getAllProducts,
    getProduct,
    searchProduct,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/product.controller");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const { uploadProduct } = require("../config/multer");

const router = express.Router();

const productUploadFields = uploadProduct.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'otherImage1', maxCount: 1 },
    { name: 'otherImage2', maxCount: 1 },
    { name: 'otherImage3', maxCount: 1 },
    { name: 'otherImage4', maxCount: 1 },
    { name: 'otherImages', maxCount: 10 }
]);

router.get("/", getAllProducts);
router.get("/search", searchProduct);
router.get("/:id", getProduct);

router.post("/", authenticateAdmin, productUploadFields, addProduct);
router.patch("/:id", authenticateAdmin, productUploadFields, updateProduct);
router.put("/:id", authenticateAdmin, productUploadFields, updateProduct);
router.delete("/:id", authenticateAdmin, deleteProduct);

module.exports = router;