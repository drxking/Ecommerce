const express = require("express");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const {
    getHomeConfig,
    getBannerUploadSignature,
    updateBanner,
    updateOrderedCollections,
    updateTopThreeCollections,
    updateFeaturedProducts
} = require("../controllers/homeConfig.controller");
const { uploadBanner } = require("../config/multer");

const router = express.Router();

// Public route to get home configuration for storefront
router.get("/", getHomeConfig);

// Admin routes to configure homepage
router.post("/banner/upload-signature", authenticateAdmin, getBannerUploadSignature);
router.post("/banner", authenticateAdmin, uploadBanner.single("media"), updateBanner);
router.patch("/banner", authenticateAdmin, uploadBanner.single("media"), updateBanner);

router.post("/ordered-collections", authenticateAdmin, updateOrderedCollections);
router.patch("/ordered-collections", authenticateAdmin, updateOrderedCollections);

router.post("/top-three", authenticateAdmin, updateTopThreeCollections);
router.patch("/top-three", authenticateAdmin, updateTopThreeCollections);

router.post("/featured-products", authenticateAdmin, updateFeaturedProducts);
router.patch("/featured-products", authenticateAdmin, updateFeaturedProducts);

module.exports = router;
