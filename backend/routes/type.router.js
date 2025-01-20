let express = require("express");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const { getSearchType } = require("../controllers/type.controller");
let router = express.Router()




router.get("/search", authenticateAdmin, getSearchType)
module.exports = router;