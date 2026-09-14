const express = require("express");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const {
    getHomeConfig,
    updateBanner,
    updateOrderedCollections,
    updateTopThreeCollections
} = require("../controllers/homeConfig.controller");
const { uploadBanner } = require("../config/multer");

const router = express.Router();

// Public route to get home configuration for storefront
router.get("/", getHomeConfig);

// Admin routes to configure homepage
router.post("/banner", authenticateAdmin, uploadBanner.single("video"), updateBanner);
router.patch("/banner", authenticateAdmin, uploadBanner.single("video"), updateBanner);

router.post("/ordered-collections", authenticateAdmin, updateOrderedCollections);
router.patch("/ordered-collections", authenticateAdmin, updateOrderedCollections);

router.post("/top-three", authenticateAdmin, updateTopThreeCollections);
router.patch("/top-three", authenticateAdmin, updateTopThreeCollections);

module.exports = router;
