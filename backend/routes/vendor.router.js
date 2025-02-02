let express = require("express");
const multer = require("multer");
const { addVendor, getVendors, updateVendor, deleteVendor } = require("../controllers/vendor.controller");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const { upload } = require("../config/multer");
const validateVendor = require("../middlewares/validateVendor");

let router = express.Router()





router.get("/", authenticateAdmin, getVendors)
router.post("/addvendor", authenticateAdmin , upload.single('image'),validateVendor, addVendor)
router.patch("/:id", authenticateAdmin, updateVendor)
router.delete("/:id", authenticateAdmin, deleteVendor)
module.exports = router;