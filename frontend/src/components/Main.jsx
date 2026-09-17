import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [allCollections, setAllCollections] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Banner states
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerRedirect, setBannerRedirect] = useState("/");
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [bannerMediaType, setBannerMediaType] = useState("video");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [savingBanner, setSavingBanner] = useState(false);

  // Ordered collections states
  const [orderedList, setOrderedList] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState("");
  const [savingOrder, setSavingOrder] = useState(false);

  // Top three collections states (array of up to 3 collection objects)
  const [topThree, setTopThree] = useState([null, null, null]);
  const [savingTopThree, setSavingTopThree] = useState(false);

  // Featured products states (up to 4 product objects)
  const [featuredProducts, setFeaturedProducts] = useState([null, null, null, null]);
  const [savingFeaturedProducts, setSavingFeaturedProducts] = useState(false);

  // Notification message
  const [message, setMessage] = useState({ text: "", type: "" });
  const videoInputRef = useRef(null);

  const showNotification = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 3500);
  };

  // Fetch home config and all collections
  const fetchData = async () => {
    try {
      setLoading(true);
      const [configRes, colRes, productRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/home-config`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/collections`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/products`),
      ]);

      const config = configRes.data?.data || {};
      const cols = colRes.data?.data || [];
      setAllCollections(cols);
      const products = Array.isArray(productRes.data)
        ? productRes.data
        : productRes.data?.data || [];
      setAllProducts(products);

      // Banner init
      if (config.banner) {
        setBannerTitle(config.banner.title || "");
        setBannerRedirect(config.banner.redirectLink || "/");
        setCurrentVideoUrl(config.banner.mediaLink || "");
        setBannerMediaType(config.banner.mediaType || "video");
      }

      // Ordered collections init
      if (config.orderedCollections && Array.isArray(config.orderedCollections)) {
        const sorted = config.orderedCollections
          .filter((item) => item && item.collection)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setOrderedList(sorted);
      }

      // Top three init
      if (config.topThreeCollections && Array.isArray(config.topThreeCollections)) {
        const slots = [null, null, null];
        config.topThreeCollections.slice(0, 3).forEach((item, idx) => {
          slots[idx] = item;
        });
        setTopThree(slots);
      }

      if (config.featuredProducts && Array.isArray(config.featuredProducts)) {
        const slots = [null, null, null, null];
        config.featuredProducts.slice(0, 4).forEach((item, idx) => {
          slots[idx] = item;
        });
        setFeaturedProducts(slots);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      showNotification("Failed to load dashboard settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle banner video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const selectedType = file.type.startsWith("image/") ? "image" : "video";
      if (selectedType !== bannerMediaType) {
        showNotification(`Please choose a ${bannerMediaType} file.`, "error");
        e.target.value = "";
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Save Banner
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      setSavingBanner(true);
      const formData = new FormData();
      formData.append("title", bannerTitle);
      formData.append("redirectLink", bannerRedirect);
      if (videoFile) {
        // Cloudinary uploads bypass the API proxy, avoiding 413 errors for
        // larger banner videos. Local storage continues to use the API upload.
        const signatureResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/home-config/banner/upload-signature`,
          {},
          { withCredentials: true }
        );
        const uploadConfig = signatureResponse.data;

        if (uploadConfig.provider === "cloudinary") {
          const cloudinaryForm = new FormData();
          cloudinaryForm.append("file", videoFile);
          cloudinaryForm.append("api_key", uploadConfig.apiKey);
          cloudinaryForm.append("timestamp", uploadConfig.timestamp);
          cloudinaryForm.append("signature", uploadConfig.signature);
          cloudinaryForm.append("folder", uploadConfig.folder);

          const cloudinaryResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${uploadConfig.cloudName}/auto/upload`,
            cloudinaryForm,
            { withCredentials: false }
          );
          formData.append("mediaUrl", cloudinaryResponse.data.secure_url);
          formData.append("mediaType", bannerMediaType);
        } else {
          formData.append("media", videoFile);
        }
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/home-config/banner`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.status === "success") {
        showNotification("Banner updated successfully!");
        if (res.data.data?.mediaLink || res.data.data?.videoLink) {
          setCurrentVideoUrl(res.data.data.mediaLink || res.data.data.videoLink);
          setBannerMediaType(res.data.data.mediaType || "video");
          setVideoPreview(null);
          setVideoFile(null);
        }
      } else {
        showNotification(res.data.message || "Failed to update banner", "error");
      }
    } catch (err) {
      console.error("Error saving banner:", err);
      showNotification(err.response?.data?.message || "Failed to update banner", "error");
    } finally {
      setSavingBanner(false);
    }
  };

  // Add a collection to ordered list
  const handleAddOrdered = () => {
    if (!selectedToAdd) return;
    const colObj = allCollections.find((c) => c._id === selectedToAdd);
    if (!colObj) return;

    // Check if already in list
    if (orderedList.some((item) => item.collection._id === selectedToAdd)) {
      showNotification("Collection already in the ordered list", "error");
      return;
    }

    const nextOrder = orderedList.length > 0
      ? Math.max(...orderedList.map((i) => Number(i.order) || 0)) + 1
      : 1;

    setOrderedList((prev) => [
      ...prev,
      { collection: colObj, order: nextOrder },
    ]);
    setSelectedToAdd("");
  };

  // Remove collection from ordered list
  const handleRemoveOrdered = (colId) => {
    setOrderedList((prev) => prev.filter((item) => item.collection._id !== colId));
  };

  // Move ordered collection up or down
  const handleMoveOrder = (index, direction) => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= orderedList.length) return;

    const newList = [...orderedList];
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;

    // Re-assign order numbers sequentially
    const updated = newList.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setOrderedList(updated);
  };

  // Update specific order number manually
  const handleOrderNumberChange = (colId, newOrder) => {
    setOrderedList((prev) =>
      prev.map((item) =>
        item.collection._id === colId
          ? { ...item, order: Number(newOrder) || 0 }
          : item
      )
    );
  };

  // Save Ordered Collections
  const handleSaveOrderedCollections = async () => {
    try {
      setSavingOrder(true);
      const payload = orderedList.map((item, idx) => ({
        collection: item.collection._id,
        order: Number(item.order) || idx + 1,
      }));

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/home-config/ordered-collections`,
        { collections: payload },
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        showNotification("Ordered collections saved successfully!");
      } else {
        showNotification(res.data.message || "Failed to save order", "error");
      }
    } catch (err) {
      console.error("Error saving ordered collections:", err);
      showNotification(err.response?.data?.message || "Failed to save order", "error");
    } finally {
      setSavingOrder(false);
    }
  };

  // Change top three slot collection
  const handleSelectTopThreeSlot = (slotIdx, colId) => {
    const colObj = allCollections.find((c) => c._id === colId) || null;
    const newSlots = [...topThree];
    newSlots[slotIdx] = colObj;
    setTopThree(newSlots);
  };

  // Save Top Three Collections
  const handleSaveTopThree = async () => {
    try {
      setSavingTopThree(true);
      const collectionIds = topThree.filter(Boolean).map((col) => col._id);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/home-config/top-three`,
        { collectionIds },
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        showNotification("Top three collections saved successfully!");
      } else {
        showNotification(res.data.message || "Failed to save top three", "error");
      }
    } catch (err) {
      console.error("Error saving top three:", err);
      showNotification(err.response?.data?.message || "Failed to save top three", "error");
    } finally {
      setSavingTopThree(false);
    }
  };

  const handleSelectFeaturedProduct = (slotIdx, productId) => {
    const product = allProducts.find((item) => item._id === productId) || null;
    setFeaturedProducts((current) => {
      const slots = [...current];
      slots[slotIdx] = product;
      return slots;
    });
  };

  const handleSaveFeaturedProducts = async () => {
    const productIds = featuredProducts.filter(Boolean).map((product) => product._id);
    if (new Set(productIds).size !== productIds.length) {
      showNotification("Choose each featured product only once.", "error");
      return;
    }

    try {
      setSavingFeaturedProducts(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/home-config/featured-products`,
        { productIds },
        { withCredentials: true }
      );
      showNotification(res.data.message || "Featured products saved successfully!", res.data.status === "success" ? "success" : "error");
    } catch (err) {
      console.error("Error saving featured products:", err);
      showNotification(err.response?.data?.message || "Failed to save featured products", "error");
    } finally {
      setSavingFeaturedProducts(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#0a0a0a] text-white">
        <div className="text-neutral-400 font-medium flex items-center gap-2 text-sm uppercase tracking-wider">
          <i className="ri-loader-4-line animate-spin text-xl text-white"></i>
          Loading Dashboard Configuration...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 text-white">
      {/* Toast Notification */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 shadow-2xl flex items-center gap-3 transition-all duration-300 font-bold text-xs uppercase tracking-wider rounded-none ${
            message.type === "error"
              ? "bg-red-600 text-white"
              : "bg-white text-black"
          }`}
          style={{ borderRadius: 0 }}
        >
          <i
            className={`text-base ${
              message.type === "error"
                ? "ri-error-warning-line"
                : "ri-checkbox-circle-line"
            }`}
          ></i>
          {message.text}
        </div>
      )}

      {/* Dashboard Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-800 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-[panchang] font-black uppercase text-white tracking-wide">
            Admin Dashboard
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Customize storefront hero banner, ordered collections, and featured top three collections.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all rounded-none"
            style={{ borderRadius: 0 }}
          >
            <i className="ri-external-link-line"></i> View Storefront
          </Link>
          <Link
            to="/admin/collections"
            className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none shadow"
            style={{ borderRadius: 0 }}
          >
            <i className="ri-folder-add-line"></i> Manage Collections
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        {/* ================= SECTION 1: BANNER VIDEO ================= */}
        <section
          className="bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 rounded-none shadow-xl"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span
                className="w-9 h-9 bg-white text-black flex items-center justify-center font-bold text-sm rounded-none"
                style={{ borderRadius: 0 }}
              >
                1
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide font-[panchang]">
                  Hero Banner Media & Title
                </h2>
                <p className="text-xs text-neutral-400">
                  Configure a hero image or video, overlay title, and redirect link
                </p>
              </div>
            </div>
            <span
              className="text-[10px] uppercase tracking-widest bg-neutral-800 border border-neutral-700 text-neutral-300 px-3 py-1 font-semibold rounded-none"
              style={{ borderRadius: 0 }}
            >
              Home Section
            </span>
          </div>

          <form onSubmit={handleSaveBanner} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Settings */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Banner Title
                </label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="e.g. Summer Collection 2026"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-none p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                  style={{ borderRadius: 0 }}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Leave blank if you want only the media without overlay text.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Redirect Page Link
                </label>
                <input
                  type="text"
                  value={bannerRedirect}
                  onChange={(e) => setBannerRedirect(e.target.value)}
                  placeholder="e.g. /collections/64f... or /products"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-none p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                  style={{ borderRadius: 0 }}
                />
                {/* Quick link helpers */}
                <div className="mt-2">
                  <span className="text-xs text-neutral-500 mr-2 uppercase tracking-wider">Quick insert:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setBannerRedirect("/products")}
                      className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded-none border border-neutral-700 transition uppercase tracking-wider"
                      style={{ borderRadius: 0 }}
                    >
                      All Products
                    </button>
                    {allCollections.slice(0, 4).map((col) => (
                      <button
                        key={col._id}
                        type="button"
                        onClick={() => setBannerRedirect(`/collections/${col._id}`)}
                        className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded-none border border-neutral-700 truncate max-w-[150px] transition"
                        style={{ borderRadius: 0 }}
                        title={col.name}
                      >
                        {col.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Banner Media Type
                </label>
                <select
                  value={bannerMediaType}
                  onChange={(e) => {
                    setBannerMediaType(e.target.value);
                    setVideoFile(null);
                    setVideoPreview(null);
                    if (videoInputRef.current) videoInputRef.current.value = "";
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-none p-3 text-sm text-white focus:outline-none focus:border-white transition"
                >
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Upload New Banner Image or Video
                </label>
                <input
                  type="file"
                  ref={videoInputRef}
                  accept={bannerMediaType === "image" ? "image/*" : "video/*"}
                  onChange={handleVideoChange}
                  className="hidden"
                />
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-700 hover:border-white p-6 text-center cursor-pointer bg-neutral-950/60 hover:bg-neutral-950 transition-all rounded-none"
                  style={{ borderRadius: 0 }}
                >
                  <i className={bannerMediaType === "image" ? "ri-image-upload-line text-3xl text-neutral-400" : "ri-video-upload-line text-3xl text-neutral-400"}></i>
                  <p className="text-sm font-medium text-neutral-300 mt-2">
                    {videoFile ? videoFile.name : "Click to browse an image or video"}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Images and videos up to 100MB. Storage provider is selected by the server.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingBanner}
                className="w-full bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider py-3.5 px-6 text-xs transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 rounded-none shadow"
                style={{ borderRadius: 0 }}
              >
                {savingBanner ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i> Saving Banner...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i> Save Banner Settings
                  </>
                )}
              </button>
            </div>

            {/* Right: Live Preview */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Live Media Preview
              </label>
              <div
                className="relative aspect-video w-full overflow-hidden bg-black border border-neutral-800 flex items-center justify-center rounded-none shadow-inner"
                style={{ borderRadius: 0 }}
              >
                {videoPreview || currentVideoUrl ? (bannerMediaType === "image" ? (
                  <img
                    src={videoPreview || currentVideoUrl}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={videoPreview || currentVideoUrl}
                    controls
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                )
                ) : (
                  <div className="text-neutral-500 text-sm flex flex-col items-center gap-2">
                    <i className="ri-image-line text-3xl"></i>
                    No media configured
                  </div>
                )}
                {/* Overlay Preview */}
                {bannerTitle && (
                  <div className="absolute inset-0 bg-black/40 pointer-events-none flex flex-col items-center justify-center p-4">
                    <h3 className="text-white font-[panchang] font-bold text-lg md:text-xl text-center uppercase drop-shadow-md">
                      {bannerTitle}
                    </h3>
                    {bannerRedirect && (
                      <span
                        className="mt-3 text-[10px] bg-white text-black font-bold uppercase tracking-wider px-3 py-1 shadow rounded-none"
                        style={{ borderRadius: 0 }}
                      >
                        Link: {bannerRedirect}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Currently loaded: <span className="font-mono text-neutral-400 truncate">{videoPreview ? "New file selected" : currentVideoUrl}</span>
              </p>
            </div>
          </form>
        </section>

        {/* ================= SECTION 2: CHOOSED COLLECTIONS IN ORDER ================= */}
        <section
          className="bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 rounded-none shadow-xl"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span
                className="w-9 h-9 bg-white text-black flex items-center justify-center font-bold text-sm rounded-none"
                style={{ borderRadius: 0 }}
              >
                2
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide font-[panchang]">
                  Choosed Collections (Set Order)
                </h2>
                <p className="text-xs text-neutral-400">
                  Pick collections to feature and customize their sequence/display order
                </p>
              </div>
            </div>
            <span
              className="text-[10px] uppercase tracking-widest bg-neutral-800 border border-neutral-700 text-neutral-300 px-3 py-1 font-semibold rounded-none"
              style={{ borderRadius: 0 }}
            >
              Ordered Catalog
            </span>
          </div>

          {/* Add to order controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
            <select
              value={selectedToAdd}
              onChange={(e) => setSelectedToAdd(e.target.value)}
              className="w-full sm:flex-1 bg-neutral-950 border border-neutral-800 rounded-none p-3 text-xs text-white focus:outline-none focus:border-white transition"
              style={{ borderRadius: 0 }}
            >
              <option value="">-- Choose a collection to add --</option>
              {allCollections.map((col) => (
                <option key={col._id} value={col._id}>
                  {col.name} {col.description ? `(${col.description.slice(0, 30)}...)` : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddOrdered}
              disabled={!selectedToAdd}
              className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200 disabled:opacity-30 px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-none"
              style={{ borderRadius: 0 }}
            >
              <i className="ri-add-line text-base"></i> Add to Order
            </button>
          </div>

          {/* Ordered List View */}
          {orderedList.length === 0 ? (
            <div
              className="py-12 border border-dashed border-neutral-800 bg-neutral-950/40 text-center text-neutral-500 rounded-none"
              style={{ borderRadius: 0 }}
            >
              <i className="ri-list-ordered text-3xl mb-2 inline-block text-neutral-600"></i>
              <p className="text-xs uppercase tracking-wider font-semibold">No collections chosen yet.</p>
              <p className="text-xs text-neutral-600 mt-1">Select a collection above to add it to your ordered list.</p>
            </div>
          ) : (
            <div
              className="overflow-x-auto border border-neutral-800 bg-neutral-950/40 mb-6 rounded-none"
              style={{ borderRadius: 0 }}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-950 text-[10px] uppercase text-neutral-400 font-semibold border-b border-neutral-800 tracking-wider">
                    <th className="p-3.5 w-16 text-center">Order</th>
                    <th className="p-3.5 w-20">Image</th>
                    <th className="p-3.5">Collection Name</th>
                    <th className="p-3.5 hidden md:table-cell">Products</th>
                    <th className="p-3.5 text-center w-36">Move</th>
                    <th className="p-3.5 text-center w-20">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80 text-xs">
                  {orderedList.map((item, index) => (
                    <tr key={item.collection._id} className="hover:bg-neutral-800/40 transition-colors">
                      {/* Order input */}
                      <td className="p-3.5 text-center font-bold">
                        <input
                          type="number"
                          value={item.order}
                          onChange={(e) =>
                            handleOrderNumberChange(item.collection._id, e.target.value)
                          }
                          className="w-14 text-center bg-neutral-900 border border-neutral-700 text-white rounded-none p-1 font-bold text-xs"
                          style={{ borderRadius: 0 }}
                          min="1"
                        />
                      </td>
                      {/* Thumbnail */}
                      <td className="p-3.5">
                        <div
                          className="w-12 h-12 overflow-hidden bg-neutral-950 border border-neutral-800 rounded-none"
                          style={{ borderRadius: 0 }}
                        >
                          {item.collection.thumbnailImageLink ? (
                            <img
                              src={item.collection.thumbnailImageLink}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">
                              N/A
                            </div>
                          )}
                        </div>
                      </td>
                      {/* Name */}
                      <td className="p-3.5">
                        <p className="font-semibold text-white">{item.collection.name}</p>
                        {item.collection.description && (
                          <p className="text-xs text-neutral-400 truncate max-w-xs">
                            {item.collection.description}
                          </p>
                        )}
                      </td>
                      {/* Product count */}
                      <td className="p-3.5 hidden md:table-cell text-neutral-400 text-xs">
                        {item.collection.products?.length || 0} products
                      </td>
                      {/* Move Up / Down */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, "up")}
                            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-20 text-neutral-200 border border-neutral-700 rounded-none transition"
                            style={{ borderRadius: 0 }}
                            title="Move Up"
                          >
                            <i className="ri-arrow-up-s-line text-base"></i>
                          </button>
                          <button
                            type="button"
                            disabled={index === orderedList.length - 1}
                            onClick={() => handleMoveOrder(index, "down")}
                            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-20 text-neutral-200 border border-neutral-700 rounded-none transition"
                            style={{ borderRadius: 0 }}
                            title="Move Down"
                          >
                            <i className="ri-arrow-down-s-line text-base"></i>
                          </button>
                        </div>
                      </td>
                      {/* Remove */}
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveOrdered(item.collection._id)}
                          className="text-red-400 hover:text-red-300 p-1.5 rounded-none hover:bg-red-950/40 transition"
                          style={{ borderRadius: 0 }}
                          title="Remove from ordered list"
                        >
                          <i className="ri-delete-bin-line text-base"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveOrderedCollections}
              disabled={savingOrder || orderedList.length === 0}
              className="bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider py-3.5 px-6 text-xs transition-all duration-300 disabled:opacity-40 flex items-center gap-2 rounded-none shadow"
              style={{ borderRadius: 0 }}
            >
              {savingOrder ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i> Saving Order...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i> Save Collection Order
                </>
              )}
            </button>
          </div>
        </section>

        {/* ================= SECTION 3: TOP THREE COLLECTIONS ================= */}
        <section
          className="bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 rounded-none shadow-xl"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span
                className="w-9 h-9 bg-white text-black flex items-center justify-center font-bold text-sm rounded-none"
                style={{ borderRadius: 0 }}
              >
                3
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide font-[panchang]">
                  Featured Collection (Top Three)
                </h2>
                <p className="text-xs text-neutral-400">
                  Personally choose the 3 collections to display under the "Featured Collection" 3-grid showcase on the homepage
                </p>
              </div>
            </div>
            <span
              className="text-[10px] uppercase tracking-widest bg-neutral-800 border border-neutral-700 text-neutral-300 px-3 py-1 font-semibold rounded-none"
              style={{ borderRadius: 0 }}
            >
              3-Grid Showcase
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[0, 1, 2].map((slotIdx) => {
              const currentSlot = topThree[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className="border border-neutral-800 p-5 bg-neutral-950/60 flex flex-col justify-between rounded-none"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">
                      Slot {slotIdx + 1}
                    </span>
                    {currentSlot && (
                      <button
                        type="button"
                        onClick={() => handleSelectTopThreeSlot(slotIdx, "")}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 uppercase tracking-wider"
                      >
                        <i className="ri-close-circle-line"></i> Clear
                      </button>
                    )}
                  </div>

                  {/* Preview of collection in slot */}
                  <div
                    className="w-full aspect-[4/3] overflow-hidden bg-neutral-950 border border-neutral-800 relative mb-4 flex items-center justify-center rounded-none"
                    style={{ borderRadius: 0 }}
                  >
                    {currentSlot?.thumbnailImageLink ? (
                      <img
                        src={currentSlot.thumbnailImageLink}
                        alt={currentSlot.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-neutral-600 text-center p-4">
                        <i className="ri-image-add-line text-3xl mb-1 inline-block"></i>
                        <p className="text-xs uppercase tracking-wider">No collection chosen</p>
                      </div>
                    )}
                    {currentSlot && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3 text-center">
                        <h4 className="text-white font-[panchang] font-bold text-xs md:text-sm uppercase tracking-wider">
                          {currentSlot.name}
                        </h4>
                      </div>
                    )}
                  </div>

                  {/* Select dropdown */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Choose Collection for Slot {slotIdx + 1}
                    </label>
                    <select
                      value={currentSlot?._id || ""}
                      onChange={(e) => handleSelectTopThreeSlot(slotIdx, e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-none transition"
                      style={{ borderRadius: 0 }}
                    >
                      <option value="">-- Choose collection --</option>
                      {allCollections.map((col) => (
                        <option key={col._id} value={col._id}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveTopThree}
              disabled={savingTopThree}
              className="bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider py-3.5 px-6 text-xs transition-all duration-300 disabled:opacity-40 flex items-center gap-2 rounded-none shadow"
              style={{ borderRadius: 0 }}
            >
              {savingTopThree ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i> Saving Top Three...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i> Save Top Three Collections
                </>
              )}
            </button>
          </div>
        </section>

        {/* ================= SECTION 4: FEATURED PRODUCTS ================= */}
        <section
          className="bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 rounded-none shadow-xl"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 bg-white text-black flex items-center justify-center font-bold text-sm rounded-none">4</span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide font-[panchang]">
                  Featured Products
                </h2>
                <p className="text-xs text-neutral-400">Choose up to 4 products shown after the ordered collections on the homepage.</p>
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-widest bg-neutral-800 border border-neutral-700 text-neutral-300 px-3 py-1 font-semibold rounded-none">Max 4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
            {featuredProducts.map((product, slotIdx) => (
              <div key={slotIdx} className="border border-neutral-800 p-4 bg-neutral-950/60 rounded-none">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">Slot {slotIdx + 1}</span>
                  {product && (
                    <button type="button" onClick={() => handleSelectFeaturedProduct(slotIdx, "")} className="text-xs text-red-400 hover:text-red-300 uppercase tracking-wider">Clear</button>
                  )}
                </div>
                <div className="aspect-square bg-neutral-950 border border-neutral-800 mb-3 flex items-center justify-center overflow-hidden">
                  {product?.imageLink ? <img src={product.imageLink} alt={product.name} className="w-full h-full object-cover" /> : <i className="ri-shopping-bag-3-line text-3xl text-neutral-600" />}
                </div>
                <p className="text-xs text-white truncate mb-3">{product?.name || "No product chosen"}</p>
                <select
                  value={product?._id || ""}
                  onChange={(e) => handleSelectFeaturedProduct(slotIdx, e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-none"
                >
                  <option value="">-- Choose product --</option>
                  {allProducts.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={handleSaveFeaturedProducts} disabled={savingFeaturedProducts} className="bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider py-3.5 px-6 text-xs transition-all disabled:opacity-40 flex items-center gap-2 rounded-none shadow">
              {savingFeaturedProducts ? <><i className="ri-loader-4-line animate-spin"></i> Saving Products...</> : <><i className="ri-save-line"></i> Save Featured Products</>}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Main;
