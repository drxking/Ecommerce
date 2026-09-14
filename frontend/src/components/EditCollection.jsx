import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";

const EditCollection = ({ open, handleClose, collection, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [fetchedTypes, setFetchedTypes] = useState([]);
  const [typeSearch, setTypeSearch] = useState("");
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  let typeSearchTimeout = useRef(null);

  // Sync state when collection or open changes
  useEffect(() => {
    if (open && collection) {
      setName(collection.name || "");
      setDescription(collection.description || "");
      setThumbnailPreview(collection.thumbnailImageLink || "");
      setThumbnailFile(null);
      setErrorMessage("");
      setSuccessMessage("");
      setTypeSearch("");
      setFetchedTypes([]);
      setIsTypeDropdownOpen(false);

      if (Array.isArray(collection.type)) {
        setSelectedTypes(
          collection.type.map((t) => (typeof t === "object" ? t : { _id: t, name: t }))
        );
      } else {
        setSelectedTypes([]);
      }
    }
  }, [open, collection]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle type search
  const handleTypeSearchChange = (e) => {
    const text = e.target.value;
    setTypeSearch(text);
    if (typeSearchTimeout.current) clearTimeout(typeSearchTimeout.current);

    if (text.trim() === "") {
      setFetchedTypes([]);
      setIsTypeDropdownOpen(false);
      return;
    }

    typeSearchTimeout.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/types/search?type=${encodeURIComponent(text)}`,
          { withCredentials: true }
        );
        if (response.data.status === "success" && Array.isArray(response.data.data)) {
          setFetchedTypes(response.data.data);
          setIsTypeDropdownOpen(true);
        } else {
          setFetchedTypes([]);
        }
      } catch (err) {
        console.error("Failed to search types:", err);
        setFetchedTypes([]);
      }
    }, 350);
  };

  const handleSelectType = (item) => {
    if (!selectedTypes.some((t) => t._id === item._id)) {
      setSelectedTypes([...selectedTypes, item]);
    }
    setTypeSearch("");
    setIsTypeDropdownOpen(false);
  };

  const handleRemoveType = (typeId) => {
    setSelectedTypes(selectedTypes.filter((t) => t._id !== typeId));
  };

  // Thumbnail change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const objectUrl = URL.createObjectURL(file);
      setThumbnailPreview(objectUrl);
    }
  };

  const handleRevertThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(collection?.thumbnailImageLink || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Collection name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      selectedTypes.forEach((t) => {
        formData.append("type[]", t._id);
      });

      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/collections/${collection._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.status === "success") {
        setSuccessMessage("Collection updated successfully!");
        if (onSuccess) {
          onSuccess(res.data.data);
        }
        setTimeout(() => {
          handleClose();
        }, 800);
      } else {
        setErrorMessage(res.data.message || "Failed to update collection");
      }
    } catch (err) {
      console.error("Error updating collection:", err);
      setErrorMessage(
        err.response?.data?.message || err.message || "Failed to update collection"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !collection) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={handleClose}></div>

      <div
        className="relative z-10 w-full max-w-xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl overflow-hidden my-8 rounded-none animate-in fade-in zoom-in-95 duration-200"
        style={{ borderRadius: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center">
              <i className="ri-edit-line text-lg"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-[panchang] tracking-wider uppercase">
                Edit Collection
              </h2>
              <p className="text-xs text-neutral-400">
                Update collection details, description, categories, and thumbnail
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <i className="ri-close-line text-xl leading-none"></i>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-red-950/60 border border-red-850 text-red-300 text-xs flex items-center gap-2">
            <i className="ri-error-warning-line text-sm text-red-400"></i>
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-950/60 border border-emerald-850 text-emerald-300 text-xs flex items-center gap-2">
            <i className="ri-checkbox-circle-line text-sm text-emerald-400"></i>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Collection Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Collection Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer 2026, Urban Casual"
              className="w-full px-4 py-2.5 rounded-none border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white transition"
              style={{ borderRadius: 0 }}
            />
          </div>

          {/* Collection Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description for the collection shown on the storefront..."
              className="w-full px-4 py-2.5 rounded-none border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white transition"
              style={{ borderRadius: 0 }}
            />
          </div>

          {/* Thumbnail Image Section */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Thumbnail Image
            </label>
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-neutral-800 bg-neutral-950/60 rounded-none"
              style={{ borderRadius: 0 }}
            >
              {/* Image Preview Box */}
              <div
                className="relative w-28 h-28 overflow-hidden bg-neutral-950 border border-neutral-800 flex-shrink-0 rounded-none"
                style={{ borderRadius: 0 }}
              >
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 text-xs">
                    <i className="ri-image-line text-2xl mb-1"></i>
                    No Image
                  </div>
                )}
                {thumbnailFile && (
                  <span
                    className="absolute top-1 left-1 bg-white text-black text-[9px] font-bold px-1.5 py-0.5 shadow uppercase tracking-wider rounded-none"
                    style={{ borderRadius: 0 }}
                  >
                    New
                  </span>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2">
                <p className="text-xs text-neutral-400">
                  {thumbnailFile
                    ? `Selected: ${thumbnailFile.name} (${(thumbnailFile.size / 1024).toFixed(1)} KB)`
                    : "Upload a high-quality image (JPG, PNG, WEBP). Stored directly on local server storage."}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="collection-edit-thumbnail-input"
                  />
                  <label
                    htmlFor="collection-edit-thumbnail-input"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition rounded-none"
                    style={{ borderRadius: 0 }}
                  >
                    <i className="ri-upload-2-line"></i>
                    {thumbnailFile ? "Choose Different Image" : "Replace Image"}
                  </label>

                  {thumbnailFile && (
                    <button
                      type="button"
                      onClick={handleRevertThumbnail}
                      className="inline-flex items-center gap-1 px-3 py-2 border border-neutral-700 text-neutral-300 text-xs font-medium hover:bg-neutral-800 transition rounded-none"
                      style={{ borderRadius: 0 }}
                    >
                      <i className="ri-arrow-go-back-line"></i> Revert
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Categories / Types Tag Selector */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Categories / Types
            </label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedTypes.length > 0 ? (
                selectedTypes.map((t) => (
                  <span
                    key={t._id}
                    className="inline-flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs px-2.5 py-1 rounded-none"
                    style={{ borderRadius: 0 }}
                  >
                    <span>{t.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveType(t._id)}
                      className="w-4 h-4 bg-neutral-700 hover:bg-white hover:text-black flex items-center justify-center text-[10px] transition"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-500 italic">
                  No categories assigned
                </span>
              )}
            </div>

            {/* Search Input for Types */}
            <div className="relative">
              <input
                type="text"
                value={typeSearch}
                onChange={handleTypeSearchChange}
                onFocus={() => {
                  if (fetchedTypes.length > 0) setIsTypeDropdownOpen(true);
                }}
                placeholder="Search categories (e.g. Shirts, Hoodies)..."
                className="w-full px-4 py-2 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-white transition rounded-none"
                style={{ borderRadius: 0 }}
              />
              <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm"></i>
            </div>

            {/* Dropdown Results */}
            {isTypeDropdownOpen && fetchedTypes.length > 0 && (
              <div
                className="absolute z-20 w-full mt-1 bg-neutral-900 border border-neutral-800 shadow-2xl max-h-48 overflow-y-auto rounded-none"
                style={{ borderRadius: 0 }}
              >
                {fetchedTypes.map((ty) => {
                  const alreadySelected = selectedTypes.some((t) => t._id === ty._id);
                  return (
                    <button
                      key={ty._id}
                      type="button"
                      disabled={alreadySelected}
                      onClick={() => handleSelectType(ty)}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between border-b border-neutral-800/60 last:border-0 transition ${
                        alreadySelected
                          ? "bg-neutral-950 text-neutral-600 cursor-not-allowed"
                          : "hover:bg-neutral-800 text-neutral-200"
                      }`}
                    >
                      <span className="capitalize">{ty.name}</span>
                      {alreadySelected && (
                        <span className="text-[10px] text-neutral-500 font-semibold uppercase">Added</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-neutral-700 text-neutral-300 text-xs font-semibold hover:bg-neutral-800 transition rounded-none uppercase tracking-wider"
              style={{ borderRadius: 0 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition shadow disabled:opacity-50 rounded-none"
              style={{ borderRadius: 0 }}
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Saving Changes...
                </>
              ) : (
                <>
                  <i className="ri-check-line text-sm"></i>
                  Update Collection
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCollection;
