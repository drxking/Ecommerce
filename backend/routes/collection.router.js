let express = require("express");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const { addCollection, getAllCollection, getCollectionWithPopulatedTypeAndProduct } = require("../controllers/collection.controller");

let router = express.Router()




router.post("/", authenticateAdmin, addCollection)
router.get("/", getAllCollection)
router.get("/admincollection", authenticateAdmin, getCollectionWithPopulatedTypeAndProduct)

module.exports = router;