let express = require("express");
const { registerUser, loginUser, getProfile, logoutUser } = require("../controllers/user.controller");

let router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", getProfile)
router.get("/logout", logoutUser)
router.post("/logout", logoutUser)

module.exports = router;