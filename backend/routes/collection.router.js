let express = require("express");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const { upload } = require("../config/multer");
let router = express.Router()




router.post("/addvendor", authenticateAdmin, upload.single('image'))
module.exports = router;