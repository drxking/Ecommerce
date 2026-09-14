import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";

const EditProduct = ({ product, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparedPrice, setComparedPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sizesInput, setSizesInput] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");

  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [collections, setCollections] = useState([]);

  // Images state
  const [currentMainImage, setCurrentMainImage] = useState("");
  const [newMainFile, setNewMainFile] = useState(null);
  const [newMainPreview, setNewMainPreview] = useState("");
  const mainFileInputRef = useRef(null);

  const [currentOtherImages, setCurrentOtherImages] = useState([]);
  const [newOtherFiles, setNewOtherFiles] = useState([]);
  const [newOtherPreviews, setNewOtherPreviews] = useState([]);
  const otherFilesInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // New Category mini-modal state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  // Load dropdown data (categories, vendors, collections)
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [typeRes, vendorRes, colRes] = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_BASE_URL}/types`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/vendors`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/collections`),
        ]);

        if (typeRes.status === "fulfilled") {
          const tData = typeRes.value.data;
          setCategories(Array.isArray(tData?.data) ? tData.data : Array.isArray(tData) ? tData : []);
        }
        if (vendorRes.status === "fulfilled") {
          const vData = vendorRes.value.data;
          setVendors(Array.isArray(vData?.data) ? vData.data : Array.isArray(vData) ? vData : []);
        }
        if (colRes.status === "fulfilled") {
          const cData = colRes.value.data;
          setCollections(Array.isArray(cData?.data) ? cData.data : Array.isArray(cData) ? cData : []);
        }
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };

    fetchDropdowns();
  }, []);

  // Pre-fill fields from product
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price !== undefined ? product.price : "");
      setComparedPrice(product.comparedPrice !== undefined && product.comparedPrice !== null ? product.comparedPrice : "");
      setStock(product.stock !== undefined ? product.stock : "");
      setSizesInput(Array.isArray(product.size) ? product.size.join(", ") : product.size || "");

      // Resolve category ID
      const catId = product.type?._id || product.type || "";
      setSelectedCategory(typeof catId === "object" ? catId._id : catId);

      // Resolve vendor ID
      const venId = product.vendor?._id || product.vendor || "";
      setSelectedVendor(typeof venId === "object" ? venId._id : venId);

      // Resolve collection ID
      const colId = product.collect?._id || product.collect || product.collection?._id || product.collection || "";
      setSelectedCollection(typeof colId === "object" ? colId._id : colId);

      setCurrentMainImage(product.imageLink || "");
      setCurrentOtherImages(Array.isArray(product.otherImageLink) ? product.otherImageLink : []);
      setNewMainFile(null);
      setNewMainPreview("");
      setNewOtherFiles([]);
      setNewOtherPreviews([]);
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [product]);

  // Handle main image change
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewMainFile(file);
      setNewMainPreview(URL.createObjectURL(file));
    }
  };

  // Handle new gallery images change
  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewOtherFiles((prev) => [...prev, ...files]);
      const previews = files.map((f) => URL.createObjectURL(f));
      setNewOtherPreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleRemoveNewOtherImage = (index) => {
    setNewOtherFiles((prev) => prev.filter((_, i) => i !== index));
    setNewOtherPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Add new category directly
  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      setAddingCategory(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/types/add`,
        { category: newCategoryName.trim() },
        { withCredentials: true }
      );
      const newCat = res.data?.data;
      if (newCat) {
        setCategories((prev) => [...prev, newCat]);
        setSelectedCategory(newCat._id);
      } else {
        // Refresh categories
        const typesRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/types`);
        const list = Array.isArray(typesRes.data?.data) ? typesRes.data.data : [];
        setCategories(list);
        const matched = list.find((c) => c.name.toLowerCase() === newCategoryName.trim().toLowerCase());
        if (matched) setSelectedCategory(matched._id);
      }
      setNewCategoryName("");
      setShowAddCategoryModal(false);
    } catch (err) {
      console.error("Error creating category:", err);
      alert("Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  };

  // Submit product update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Product name is required.");
      return;
    }
    if (price === "" || isNaN(Number(price))) {
      setErrorMessage("Valid product price is required.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description);
      formData.append("price", price);
      formData.append("comparedPrice", comparedPrice || "");
      formData.append("stock", stock !== "" ? stock : 0);

      // Sizes
      const sizesArray = sizesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      sizesArray.forEach((s) => formData.append("size[]", s));
      // Also append as comma string for flexibility
      formData.append("size", sizesInput);

      // Relations
      formData.append("category", selectedCategory || "none");
      formData.append("type", selectedCategory || "none");
      formData.append("vendor", selectedVendor || "none");
      formData.append("collection", selectedCollection || "none");

      // New main image
      if (newMainFile) {
        formData.append("mainImage", newMainFile);
      }

      // New gallery images
      newOtherFiles.forEach((file, idx) => {
        formData.append(`otherImage${idx + 1}`, file);
        formData.append("otherImages", file);
      });

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/products/${product._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status === "success" || response.data._id) {
        setSuccessMessage("Product updated successfully!");
        setTimeout(() => {
          if (onSuccess) onSuccess(response.data.data || response.data);
        }, 600);
      } else {
        setErrorMessage(response.data.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setErrorMessage(
        err.response?.data?.message || err.response?.data?.error || "Server error updating product"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={!loading ? onClose : undefined}></div>

      <div
        className="relative z-10 w-full max-w-4xl bg-neutral-900 border border-neutral-800 text-white shadow-2xl my-8 overflow-hidden rounded-none"
        style={{ borderRadius: 0 }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-neutral-800 bg-neutral-950/60">
          <div>
            <p className="text-[10px] uppercase font-semibold tracking-widest text-neutral-400 font-[panchang]">
              Admin Control
            </p>
            <h2 className="text-base md:text-lg font-bold font-[panchang] uppercase tracking-tight text-white mt-0.5">
              Update Product
            </h2>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Feedback banners */}
        {errorMessage && (
          <div className="mx-6 mt-6 p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <i className="ri-error-warning-line text-base flex-shrink-0"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-6 p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <i className="ri-checkbox-circle-line text-base flex-shrink-0"></i>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-6 max-h-[75vh] overflow-y-auto no-scroller">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Product Details (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Heavyweight Oversized Hoodie"
                  required
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white rounded-none text-xs"
                  style={{ borderRadius: 0 }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  placeholder="Garment details, fit, fabric composition, and specs..."
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white rounded-none text-xs"
                  style={{ borderRadius: 0 }}
                ></textarea>
              </div>

              {/* Price & Compared Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1499"
                    required
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white rounded-none text-xs font-mono"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Compared Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={comparedPrice}
                    onChange={(e) => setComparedPrice(e.target.value)}
                    placeholder="1999"
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white rounded-none text-xs font-mono"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              {/* Stock & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white rounded-none text-xs font-mono"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Sizes (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white rounded-none text-xs"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              {/* Collections Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Collection Dropdown
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-white rounded-none text-xs uppercase tracking-wider cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  <option value="">-- No Collection Attached --</option>
                  {collections.map((col) => (
                    <option key={col._id} value={col._id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendors Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Vendor / Brand Dropdown
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-white rounded-none text-xs uppercase tracking-wider cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  <option value="">-- In-House / No Vendor --</option>
                  {vendors.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column: Category Dropdown & Imagery (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Category Dropdown with + New button */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Category Dropdown
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 p-2.5 bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-white rounded-none text-xs uppercase tracking-wider cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(true)}
                    className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-white rounded-none transition flex-shrink-0"
                    style={{ borderRadius: 0 }}
                  >
                    + New
                  </button>
                </div>
              </div>

              {/* Main Image Box */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Primary Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={mainFileInputRef}
                  onChange={handleMainImageChange}
                  className="hidden"
                />
                <div
                  onClick={() => mainFileInputRef.current?.click()}
                  className="w-full aspect-[4/3] bg-neutral-950 border border-dashed border-neutral-800 hover:border-neutral-600 transition flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
                >
                  {newMainPreview || currentMainImage ? (
                    <>
                      <img
                        src={newMainPreview || currentMainImage}
                        alt="Product visual"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-xs gap-1">
                        <i className="ri-upload-2-line text-lg"></i>
                        <span>Click to change image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-neutral-500 text-xs">
                      <i className="ri-image-add-line text-2xl mb-1"></i>
                      <span>Upload Main Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images Strip */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Gallery Images
                  </label>
                  <button
                    type="button"
                    onClick={() => otherFilesInputRef.current?.click()}
                    className="text-[11px] text-neutral-400 hover:text-white uppercase tracking-wider underline underline-offset-2"
                  >
                    + Add More
                  </button>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={otherFilesInputRef}
                  onChange={handleOtherImagesChange}
                  className="hidden"
                />

                <div className="grid grid-cols-4 gap-2">
                  {/* Existing gallery images */}
                  {currentOtherImages.map((img, idx) => (
                    <div
                      key={`existing-${idx}`}
                      className="aspect-square bg-neutral-950 border border-neutral-800 overflow-hidden relative group"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Newly uploaded gallery images */}
                  {newOtherPreviews.map((preview, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="aspect-square bg-neutral-950 border border-white/40 overflow-hidden relative group"
                    >
                      <img
                        src={preview}
                        alt={`New ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewOtherImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Empty trigger button */}
                  <button
                    type="button"
                    onClick={() => otherFilesInputRef.current?.click()}
                    className="aspect-square bg-neutral-950 border border-dashed border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-neutral-500 hover:text-white transition"
                  >
                    <i className="ri-add-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-5 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition rounded-none"
              style={{ borderRadius: 0 }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition rounded-none disabled:opacity-50 inline-flex items-center gap-2 shadow-lg"
              style={{ borderRadius: 0 }}
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i> Saving...
                </>
              ) : (
                "Save & Update Product"
              )}
            </button>
          </div>
        </form>

        {/* Modal: New Category Quick Creation */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div
              className="bg-neutral-900 border border-neutral-800 p-6 max-w-sm w-full space-y-4 shadow-2xl rounded-none"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-sm font-bold font-[panchang] uppercase text-white">
                  Add New Category
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>

              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Hoodies, Denim, Accessories"
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white rounded-none text-xs"
                style={{ borderRadius: 0 }}
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider border border-neutral-800 text-neutral-400 hover:text-white rounded-none"
                  style={{ borderRadius: 0 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={addingCategory || !newCategoryName.trim()}
                  onClick={handleSaveCategory}
                  className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 disabled:opacity-50 rounded-none transition"
                  style={{ borderRadius: 0 }}
                >
                  {addingCategory ? "Saving..." : "Save Category"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
