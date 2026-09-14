const express = require("express");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const {
  addCollection,
  updateCollection,
  getAllCollection,
  getOneCollection,
  getPureCollection,
  getThreeCollection,
  getOrderedCollections,
  addProductToCollection,
  uploadFiles,
  removeProductFromCollection,
  removeCollection
} = require("../controllers/collection.controller");

const router = express.Router();

router.post("/", authenticateAdmin, uploadFiles, addCollection);
router.get("/", getAllCollection);
router.get("/pure", getPureCollection);
router.get("/three-collection", getThreeCollection);
router.get("/ordered", getOrderedCollections);
router.get("/:id", getOneCollection);
router.patch("/:id", authenticateAdmin, uploadFiles, updateCollection);
router.put("/:id", authenticateAdmin, uploadFiles, updateCollection);
router.delete("/:id", authenticateAdmin, removeCollection);
router.patch("/:collection/add/:product", authenticateAdmin, addProductToCollection);
router.patch("/:collection/remove/:product", authenticateAdmin, removeProductFromCollection);

module.exports = router;