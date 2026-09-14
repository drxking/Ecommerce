const express = require("express");
const { addVendor, getVendors, updateVendor, deleteVendor } = require("../controllers/vendor.controller");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const { uploadVendor } = require("../config/multer");
const validateVendor = require("../middlewares/validateVendor");

const router = express.Router();

router.get("/", authenticateAdmin, getVendors);
router.post("/addvendor", authenticateAdmin, uploadVendor.single('image'), validateVendor, addVendor);
router.patch("/:id", authenticateAdmin, uploadVendor.single('image'), updateVendor);
router.delete("/:id", authenticateAdmin, deleteVendor);

module.exports = router;