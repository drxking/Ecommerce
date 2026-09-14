const express = require("express");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const { getSearchType, getAllTypes, addType, deleteType } = require("../controllers/type.controller");
const { uploadCategory } = require("../config/multer");

const router = express.Router();

router.get("/", getAllTypes);
router.get("/search", getSearchType);
router.post("/add", authenticateAdmin, uploadCategory.single('image'), addType);
router.delete("/:id", authenticateAdmin, deleteType);

module.exports = router;