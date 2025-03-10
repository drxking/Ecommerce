let express = require("express");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const { addCollection, getAllCollection, getOneCollection, getPureCollection, getThreeCollection, addProductToCollection, uploadFiles } = require("../controllers/collection.controller");
const { upload } = require("../config/multer");

let router = express.Router()




router.post("/", authenticateAdmin, uploadFiles, addCollection)

router.get("/", getAllCollection)

router.get("/pure", getPureCollection)
router.get("/three-collection", getThreeCollection)

router.get("/:id", getOneCollection)
router.patch("/:collection/:product",  addProductToCollection)
module.exports = router;