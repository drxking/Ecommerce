let express = require("express");
let router = express.Router()
let { authenticateAdmin } = require("../middlewares/authenticateAdmin")

router.get("/isadmin", authenticateAdmin, (req, res) => {
    res.json({
        "message": "Admin Authenticated",
        "status": "success",
        "isAdmin":true
    })
})



module.exports = router;