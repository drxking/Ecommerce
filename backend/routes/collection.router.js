let express = require("express");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const { addCollection, getAllCollection, getOneCollection, getPureCollection, getThreeCollection, addProductToCollection, uploadFiles, removeProductFromCollection, removeCollection } = require("../controllers/collection.controller");
const { upload } = require("../config/multer");

let router = express.Router()




router.post("/", authenticateAdmin, uploadFiles, addCollection)

router.get("/", getAllCollection)

router.get("/pure", getPureCollection)
router.get("/three-collection", getThreeCollection)

router.get("/:id", getOneCollection)
router.delete("/:id", authenticateAdmin, removeCollection)
router.patch("/:collection/add/:product", authenticateAdmin, addProductToCollection)
router.patch("/:collection/remove/:product", authenticateAdmin, removeProductFromCollection)
module.exports = router;