const productModel = require("../models/product.model");
const { vendorModel } = require("../models/vendor.model");
const typeModel = require("../models/type.model");
const collectionModel = require("../models/collection.model");
const mongoose = require("mongoose");
const { getFileUrl, deleteLocalFile, cleanupUploadedFiles } = require("../utils/fileStorage");

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find()
            .sort({ views: -1, _id: -1 })
            .populate("vendor")
            .populate("type")
            .populate("collect");
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products", details: err.message });
    }
};

module.exports.getProduct = async (req, res) => {
    const { id } = req.params;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        const product = await productModel.findOne({ _id: id })
            .populate("vendor")
            .populate("type")
            .populate("collect");

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch product", details: err.message });
    }
};

module.exports.searchProduct = async (req, res) => {
    const product = req.query.product;
    if (!product) {
        return res.status(400).json({ error: "Invalid product query" });
    }

    let regex = new RegExp(`^${product}`, 'i');

    try {
        const products = await productModel.find({ "name": regex }).limit(5);
        if (products.length > 0) {
            res.json({
                "message": "Product Found",
                "status": "success",
                "data": products
            });
        } else {
            res.json({
                "message": "Product not Found",
                "status": "failed"
            });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to search products", details: err.message });
    }
};

module.exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, vendor, type, collection, category, size, stock, comparedPrice } = req.body;

        if (!name || price === undefined || price === null || price === '') {
            cleanupUploadedFiles(req.files);
            return res.status(400).json({
                message: "Product name and price are required",
                status: "failed"
            });
        }

        // Get main image
        const mainImageFile = req.files?.mainImage?.[0] || req.files?.image?.[0] || req.file;
        if (!mainImageFile) {
            cleanupUploadedFiles(req.files);
            return res.status(400).json({
                message: "Main product image is required",
                status: "failed"
            });
        }

        const imageLink = getFileUrl(req, `/uploads/products/${mainImageFile.filename}`);

        // Gather secondary/other images
        const otherImageLinks = [];
        const otherFields = ['otherImage1', 'otherImage2', 'otherImage3', 'otherImage4', 'otherImages'];
        otherFields.forEach((field) => {
            if (req.files && req.files[field]) {
                req.files[field].forEach((f) => {
                    otherImageLinks.push(getFileUrl(req, `/uploads/products/${f.filename}`));
                });
            }
        });

        // Resolve vendor
        let vendorId = null;
        if (vendor) {
            if (mongoose.Types.ObjectId.isValid(vendor)) {
                vendorId = vendor;
            } else {
                const foundVendor = await vendorModel.findOne({ name: vendor });
                if (foundVendor) vendorId = foundVendor._id;
            }
        }

        // Resolve type / category
        let typeId = null;
        const categoryName = category || type;
        if (categoryName) {
            if (mongoose.Types.ObjectId.isValid(categoryName)) {
                typeId = categoryName;
            } else {
                let foundType = await typeModel.findOne({ name: categoryName });
                if (!foundType) {
                    foundType = await typeModel.create({ name: categoryName });
                }
                typeId = foundType._id;
            }
        }

        // Resolve collection
        let collectionId = null;
        if (collection) {
            if (mongoose.Types.ObjectId.isValid(collection)) {
                collectionId = collection;
            } else {
                const foundCol = await collectionModel.findOne({ name: collection });
                if (foundCol) collectionId = foundCol._id;
            }
        }

        // Parse sizes
        let parsedSizes = [];
        if (size) {
            if (Array.isArray(size)) {
                parsedSizes = size;
            } else if (typeof size === 'string') {
                parsedSizes = size.split(',').map((s) => s.trim()).filter(Boolean);
            }
        }

        const productStock = stock ? Number(stock) : 0;

        const newProduct = await productModel.create({
            name,
            description,
            price: Number(price),
            vendor: vendorId,
            type: typeId,
            collect: collectionId,
            imageLink,
            otherImageLink: otherImageLinks,
            size: parsedSizes,
            stock: productStock,
            remainingStock: productStock
        });

        // Link to collection if specified
        if (collectionId) {
            await collectionModel.findByIdAndUpdate(collectionId, {
                $addToSet: { products: newProduct._id }
            });
        }

        // Link to type/category if specified
        if (typeId) {
            await typeModel.findByIdAndUpdate(typeId, {
                $addToSet: { products: newProduct._id }
            });
        }

        res.status(201).json({
            message: "Product created successfully",
            status: "success",
            data: newProduct
        });
    } catch (err) {
        cleanupUploadedFiles(req.files);
        console.error("Error creating product:", err);
        res.status(500).json({
            message: "Failed to create product",
            status: "failed",
            error: err.message
        });
    }
};

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        cleanupUploadedFiles(req.files);
        return res.status(400).json({ error: "Invalid product ID", status: "failed" });
    }

    try {
        const oldProduct = await productModel.findById(id);
        if (!oldProduct) {
            cleanupUploadedFiles(req.files);
            return res.status(404).json({ message: "Product not found", status: "failed" });
        }

        const { name, description, price, comparedPrice, vendor, type, collection, category, size, stock } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined && price !== "") updateData.price = Number(price);
        if (comparedPrice !== undefined) {
            updateData.comparedPrice = comparedPrice === "" ? null : Number(comparedPrice);
        }
        if (stock !== undefined && stock !== "") {
            updateData.stock = Number(stock);
            updateData.remainingStock = Number(stock);
        }
        if (size !== undefined) {
            updateData.size = Array.isArray(size) ? size : size.split(',').map((s) => s.trim()).filter(Boolean);
        }

        // Handle main image update
        const mainImageFile = req.files?.mainImage?.[0] || req.files?.image?.[0] || req.file;
        if (mainImageFile) {
            updateData.imageLink = getFileUrl(req, `/uploads/products/${mainImageFile.filename}`);
            if (oldProduct.imageLink) {
                deleteLocalFile(oldProduct.imageLink);
            }
        }

        // Handle other images update if provided
        const newOtherImages = [];
        ['otherImage1', 'otherImage2', 'otherImage3', 'otherImage4', 'otherImages'].forEach((field) => {
            if (req.files && req.files[field]) {
                req.files[field].forEach((f) => {
                    newOtherImages.push(getFileUrl(req, `/uploads/products/${f.filename}`));
                });
            }
        });

        if (newOtherImages.length > 0) {
            updateData.otherImageLink = [...(oldProduct.otherImageLink || []), ...newOtherImages];
        }

        // Resolve vendor
        if (vendor !== undefined) {
            if (!vendor || vendor === "none") {
                updateData.vendor = null;
            } else if (mongoose.Types.ObjectId.isValid(vendor)) {
                updateData.vendor = vendor;
            } else {
                const foundVendor = await vendorModel.findOne({ name: vendor });
                if (foundVendor) updateData.vendor = foundVendor._id;
            }
        }

        // Resolve category/type
        const categoryVal = category !== undefined ? category : type;
        if (categoryVal !== undefined) {
            if (!categoryVal || categoryVal === "none") {
                updateData.type = null;
            } else if (mongoose.Types.ObjectId.isValid(categoryVal)) {
                updateData.type = categoryVal;
            } else {
                let foundType = await typeModel.findOne({ name: categoryVal });
                if (!foundType) {
                    foundType = await typeModel.create({ name: categoryVal });
                }
                updateData.type = foundType._id;
            }
        }

        // Resolve collection
        if (collection !== undefined) {
            if (!collection || collection === "none") {
                updateData.collect = null;
            } else if (mongoose.Types.ObjectId.isValid(collection)) {
                updateData.collect = collection;
            } else {
                const foundCol = await collectionModel.findOne({ name: collection });
                if (foundCol) updateData.collect = foundCol._id;
            }
        }

        // Sync bidirectional relations for collection
        if (updateData.collect !== undefined) {
            if (updateData.collect && String(updateData.collect) !== String(oldProduct.collect)) {
                if (oldProduct.collect) {
                    await collectionModel.findByIdAndUpdate(oldProduct.collect, {
                        $pull: { products: id }
                    });
                }
                await collectionModel.findByIdAndUpdate(updateData.collect, {
                    $addToSet: { products: id }
                });
            } else if (updateData.collect === null && oldProduct.collect) {
                await collectionModel.findByIdAndUpdate(oldProduct.collect, {
                    $pull: { products: id }
                });
            }
        }

        // Sync bidirectional relations for category/type
        if (updateData.type !== undefined) {
            if (updateData.type && String(updateData.type) !== String(oldProduct.type)) {
                if (oldProduct.type) {
                    await typeModel.findByIdAndUpdate(oldProduct.type, {
                        $pull: { products: id }
                    });
                }
                await typeModel.findByIdAndUpdate(updateData.type, {
                    $addToSet: { products: id }
                });
            } else if (updateData.type === null && oldProduct.type) {
                await typeModel.findByIdAndUpdate(oldProduct.type, {
                    $pull: { products: id }
                });
            }
        }

        const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true });

        res.json({
            message: "Product updated successfully",
            status: "success",
            data: updatedProduct
        });
    } catch (err) {
        cleanupUploadedFiles(req.files);
        console.error("Error updating product:", err);
        res.status(500).json({
            message: "Failed to update product",
            status: "failed",
            error: err.message
        });
    }
};

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID", status: "failed" });
    }

    try {
        const product = await productModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found", status: "failed" });
        }

        // Delete local images
        if (product.imageLink) {
            deleteLocalFile(product.imageLink);
        }
        if (Array.isArray(product.otherImageLink)) {
            product.otherImageLink.forEach((link) => deleteLocalFile(link));
        }

        // Remove from collections
        await collectionModel.updateMany(
            { products: id },
            { $pull: { products: id } }
        );

        // Remove from types
        await typeModel.updateMany(
            { products: id },
            { $pull: { products: id } }
        );

        res.json({
            message: "Product deleted successfully",
            status: "success",
            data: product
        });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({
            message: "Failed to delete product",
            status: "failed",
            error: err.message
        });
    }
};