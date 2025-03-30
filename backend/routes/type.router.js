let express = require("express");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const { getSearchType, addType } = require("../controllers/type.controller");
let router = express.Router()




router.get("/search", authenticateAdmin, getSearchType)
router.post("/add", authenticateAdmin, addType)

module.exports = router;