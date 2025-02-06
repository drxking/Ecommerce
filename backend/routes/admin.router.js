let express = require("express");
const { loginAdmin } = require("../controllers/admin.controller");
let router = express.Router()

router.post("/login", loginAdmin)

module.exports = router;