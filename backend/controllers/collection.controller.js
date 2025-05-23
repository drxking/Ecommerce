let collectionModel = require("../models/collection.model");
const generateRandomString = require("../utils/randomNameGenerator");

const multer = require("multer");
const axios = require("axios");
const cloudinary = require('cloudinary').v2;

// Set up multer storage
const storage = multer.memoryStorage();

// Set up multer upload
const upload = multer({ storage: storage });

module.exports.uploadFiles = upload.fields([
  { name: 'thumbnail', maxCount: 1 }
]);

module.exports.addCollection = async (req, res) => {
  let { name, type, products } = req.body;
  if (!name || type?.length == 0 || products?.length == 0) {
    return res.status(400).json({
      "message": "All Fields required",
      "status": "failed"
    });
  }

  try {
    const thumbnailFile = req.files.thumbnail[0];

    // Upload files to BunnyCDN
    if (!thumbnailFile) {
      return res.status(400).json({
        "message": "Thumbnail Image required",
        "status": "failed"
      });
    }
    const thumbnailUploadResponse = await uploadToCloudinary(thumbnailFile);

    let collection = await collectionModel.create({
      name,
      type,
      products,
      thumbnailImageLink: thumbnailUploadResponse
    });

    res.json({
      "message": "Added Collection",
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

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "collection", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        console.log(result.secure_url);
        resolve(result.secure_url);

      }
    );
    stream.end(file.buffer);
  });
}

module.exports.getThreeCollection = async (req, res) => {
  try {
    let collections = await collectionModel.find().limit(3)
    res.json({
      "message": "Fetched Collection",
      "status": "success",
      "data": collections
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    })
  }
}

module.exports.getAllCollection = async (req, res) => {
  try {
    let collections = await collectionModel.find().populate('type').populate("products")
    res.json({
      "message": "Fetched Collection",
      "status": "success",
      "data": collections
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    })
  }
}

module.exports.getPureCollection = async (req, res) => {
  try {
    let collections = await collectionModel.aggregate([
      { $project: { name: 1, thumbnailImageLink: 1 } }
    ])
    res.json({
      "message": "Fetched need field of Collection",
      "status": "success",
      "data": collections
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    })
  }
}

module.exports.getOneCollection = async (req, res) => {
  let { id } = req.params
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
    )
    if (collection) {
      res.json({
        "message": "Fetched Collection Successfully",
        "status": "success",
        "data": collection
      })
    }
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    })
  }
}

module.exports.addProductToCollection = async (req, res) => {
  let collection = req.params.collection;
  let product = req.params.product
  try {
    let newCollection = await collectionModel.findByIdAndUpdate(
      collection,
      {
        $push: {
          products: product
        }
      },
      { new: true, useFindAndModify: false }
    )
    console.log(newCollection)
    res.json({
      "message": "Fetched Collection Successfully",
      "status": "success",
      "data": collection
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    })
  }
}

module.exports.removeProductFromCollection = async (req, res) => {
  let collection = req.params.collection;
  let product = req.params.product
  try {
    let newCollection = await collectionModel.findByIdAndUpdate(
      collection,
      {
        $pull: {
          products: product
        }
      },
      { new: true, useFindAndModify: false }
    )
    console.log(newCollection)
    res.json({
      "message": "Fetched Collection Successfully",
      "status": "success",
      "data": collection
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "failed",
      "error": err.message
    })
  }
}

module.exports.removeCollection = async (req, res) => {
  let { id } = req.params;
  try {
    let collection = await collectionModel.findByIdAndDelete(id);
    if (collection) {
      // Extract the public ID from the Cloudinary URL
      const publicId = collection.thumbnailImageLink.split('/').pop().split('.')[0];

      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(`collection/${publicId}`, (error, result) => {
        if (error) {
          console.log("Error deleting image from Cloudinary:", error);
        } else {
          console.log("Image deleted from Cloudinary:", result);
        }
      });

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