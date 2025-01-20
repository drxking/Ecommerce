let express = require("express");
const { addVendor, getVendors, updateVendor, deleteVendor } = require("../controllers/vendor.controller");
const { authenticateAdmin, checkInputs } = require("../middlewares/authenticateAdmin");
const { upload } = require("../config/multer");
let router = express.Router()




router.get("/", authenticateAdmin, getVendors)
router.post("/addvendor", authenticateAdmin, upload.single('image'), addVendor)
router.patch("/:id", authenticateAdmin, updateVendor)
router.delete("/:id", authenticateAdmin, deleteVendor)
module.exports = router;