let express = require("express");
const { registerUser, loginUser } = require("../controllers/user.controller");

let router = express.Router()

router.post("/register", registerUser)

router.post("/login", loginUser)

module.exports = router;