let collectionModel = require("../models/collection.model");
const homeConfigModel = require("../models/homeConfig.model");
const { uploadCollection } = require("../config/multer");
const { getFileUrl, deleteLocalFile, cleanupUploadedFiles } = require("../utils/fileStorage");

// Multer upload middleware for collection thumbnail
module.exports.uploadFiles = uploadCollection.fields([
  { name: 'thumbnail', maxCount: 1 }
]);

module.exports.addCollection = async (req, res) => {
  let { name, description, type, products } = req.body;
  if (!name || type?.length == 0 || products?.length == 0) {
    cleanupUploadedFiles(req.files);
    return res.status(400).json({
      "message": "All Fields required",
      "status": "failed"
    });
  }

  try {
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!thumbnailFile) {
      return res.status(400).json({
        "message": "Thumbnail Image required",
        "status": "failed"
      });
    }

    const thumbnailImageLink = getFileUrl(req, `/uploads/collections/${thumbnailFile.filename}`);

    let collection = await collectionModel.create({
      name,
      description,
      type,
      products,
      thumbnailImageLink
    });

    res.json({
      "message": "Added Collection",
      "status": "success",
      "data": collection
    });

  } catch (err) {
    cleanupUploadedFiles(req.files);
    console.log(err);
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    });
  }
};

module.exports.updateCollection = async (req, res) => {
  let { id } = req.params;
  let { name, description, type, products } = req.body;
  if (!type && req.body["type[]"]) type = req.body["type[]"];
  if (!products && req.body["products[]"]) products = req.body["products[]"];

  try {
    const oldCollection = await collectionModel.findById(id);
    if (!oldCollection) {
      cleanupUploadedFiles(req.files);
      if (req.file) cleanupUploadedFiles(req.file);
      return res.status(404).json({
        "message": "Collection not found",
        "status": "failed"
      });
    }

    const updateData = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;

    if (type !== undefined) {
      if (typeof type === "string") {
        try {
          const parsed = JSON.parse(type);
          updateData.type = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          updateData.type = type.split(",").map((t) => t.trim()).filter(Boolean);
        }
      } else if (Array.isArray(type)) {
        updateData.type = type;
      }
    }

    if (products !== undefined) {
      if (typeof products === "string") {
        try {
          const parsed = JSON.parse(products);
          updateData.products = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          updateData.products = products.split(",").map((p) => p.trim()).filter(Boolean);
        }
      } else if (Array.isArray(products)) {
        updateData.products = products;
      }
    }

    const thumbnailFile = req.file || req.files?.thumbnail?.[0];
    if (thumbnailFile) {
      updateData.thumbnailImageLink = getFileUrl(req, `/uploads/collections/${thumbnailFile.filename}`);
      if (oldCollection.thumbnailImageLink && oldCollection.thumbnailImageLink.includes("/uploads/collections/")) {
        deleteLocalFile(oldCollection.thumbnailImageLink);
      }
    }

    const updated = await collectionModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    )
      .populate("type")
      .populate("products");

    res.json({
      "message": "Updated Collection Successfully",
      "status": "success",
      "data": updated
    });
  } catch (err) {
    cleanupUploadedFiles(req.files);
    if (req.file) cleanupUploadedFiles(req.file);
    console.log(err);
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    });
  }
};

module.exports.getThreeCollection = async (req, res) => {
  try {
    const homeConfig = await homeConfigModel.findOne().populate("topThreeCollections");
    let collections = [];

    if (homeConfig && homeConfig.topThreeCollections && homeConfig.topThreeCollections.length > 0) {
      collections = homeConfig.topThreeCollections;
    } else {
      collections = await collectionModel.find().limit(3);
    }

    res.json({
      "message": "Fetched Collection",
      "status": "success",
      "data": collections
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    });
  }
};

module.exports.getOrderedCollections = async (req, res) => {
  try {
    const homeConfig = await homeConfigModel.findOne().populate("orderedCollections.collect");
    let collections = [];

    if (homeConfig && homeConfig.orderedCollections && homeConfig.orderedCollections.length > 0) {
      collections = homeConfig.orderedCollections
        .filter(item => item && (item.collect || item.collection))
        .sort((a, b) => a.order - b.order)
        .map(item => {
          const c = item.collect || item.collection;
          return {
            ...(c.toObject ? c.toObject() : c),
            order: item.order
          };
        });
    } else {
      collections = await collectionModel.find();
    }

    res.json({
      "message": "Fetched Ordered Collections",
      "status": "success",
      "data": collections
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    });
  }
};

module.exports.getAllCollection = async (req, res) => {
  try {
    let collections = await collectionModel.find().populate('type').populate("products");
    res.json({
      "message": "Fetched Collection",
      "status": "success",
      "data": collections
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    });
  }
};

module.exports.getPureCollection = async (req, res) => {
  try {
    let collections = await collectionModel.aggregate([
      { $project: { name: 1, description: 1, thumbnailImageLink: 1 } }
    ]);
    res.json({
      "message": "Fetched need field of Collection",
      "status": "success",
      "data": collections
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    });
  }
};

module.exports.getOneCollection = async (req, res) => {
  let { id } = req.params;
  try {
    let collection = await collectionModel.findOne({ _id: id }).populate(
      {
        path: "products",
        limit: 8
      }
    ).populate(
      {
        path: "type"
      }
    );
    if (collection) {
      res.json({
        "message": "Fetched Collection Successfully",
        "status": "success",
        "data": collection
      });
    } else {
      res.status(404).json({
        "message": "Collection not found",
        "status": "failed"
      });
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    });
  }
};

module.exports.addProductToCollection = async (req, res) => {
  let collection = req.params.collection;
  let product = req.params.product;
  try {
    let newCollection = await collectionModel.findByIdAndUpdate(
      collection,
      {
        $push: {
          products: product
        }
      },
      { new: true, useFindAndModify: false }
    );
    console.log(newCollection);
    res.json({
      "message": "Fetched Collection Successfully",
      "status": "success",
      "data": collection
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    });
  }
};

module.exports.removeProductFromCollection = async (req, res) => {
  let collection = req.params.collection;
  let product = req.params.product;
  try {
    let newCollection = await collectionModel.findByIdAndUpdate(
      collection,
      {
        $pull: {
          products: product
        }
      },
      { new: true, useFindAndModify: false }
    );
    console.log(newCollection);
    res.json({
      "message": "Fetched Collection Successfully",
      "status": "success",
      "data": collection
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    });
  }
};

module.exports.removeCollection = async (req, res) => {
  let { id } = req.params;
  try {
    let collection = await collectionModel.findByIdAndDelete(id);
    if (collection) {
      // Delete image from local storage
      if (collection.thumbnailImageLink) {
        deleteLocalFile(collection.thumbnailImageLink);
      }

      // Also remove from homeConfig if present
      await homeConfigModel.updateMany(
        {},
        {
          $pull: {
            topThreeCollections: id,
            orderedCollections: { collection: id }
          }
        }
      );

      res.json({
        "message": "Deleted Collection Successfully",
        "status": "success",
        "data": collection
      });
    } else {
      res.status(404).json({
        "message": "Collection not found",
        "status": "failed"
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    });
  }
};