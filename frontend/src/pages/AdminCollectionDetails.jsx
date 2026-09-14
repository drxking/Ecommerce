import React, { useEffect, useMemo, useRef, useState } from "react";
import AdminNav from "../components/AdminNav";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import "remixicon/fonts/remixicon.css";
import EditCollection from "../components/EditCollection";

const AdminCollectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals & Panels
  const [editOpen, setEditOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // In-collection search
  const [collectionSearch, setCollectionSearch] = useState("");

  // Add Product search state
  const [searchProductText, setSearchProductText] = useState("");
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const searchTimeoutRef = useRef(null);

  // Fetch single collection details
  const fetchOneCollection = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/collections/${id}`,
        { withCredentials: true }
      );
      if (response.data.status === "success") {
        setData(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch collection details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOneCollection();
  }, [id]);

  // Handle live search for products to add
  const handleProductSearchChange = (e) => {
    const text = e.target.value;
    setSearchProductText(text);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (text.trim() === "") {
      setFetchedProducts([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/products/search?product=${encodeURIComponent(text)}`,
          { withCredentials: true }
        );
        if (response.data.status === "success" && Array.isArray(response.data.data)) {
          // Filter out products already in this collection
          const existingIds = new Set(data?.products?.map((p) => p._id) || []);
          const filtered = response.data.data.filter((p) => !existingIds.has(p._id));
          setFetchedProducts(filtered);
        } else {
          setFetchedProducts([]);
        }
      } catch (err) {
        console.error("Error searching products:", err);
        setFetchedProducts([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
  };

  // Add product to collection
  const handleAddProduct = async (product) => {
    try {
      setAddingId(product._id);
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/collections/${id}/add/${product._id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        setData((prev) => ({
          ...prev,
          products: [...(prev?.products || []), product],
        }));
        // Remove from search results
        setFetchedProducts((prev) => prev.filter((p) => p._id !== product._id));
      }
    } catch (err) {
      console.error("Failed to add product to collection:", err);
    } finally {
      setAddingId(null);
    }
  };

  // Remove product from collection
  const handleProductRemove = async (e, productId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/collections/${id}/remove/${productId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        setData((prev) => ({
          ...prev,
          products: prev.products.filter((item) => item._id !== productId),
        }));
      }
    } catch (err) {
      console.error("Failed to remove product from collection:", err);
    }
  };

  // Delete entire collection
  const handleCollectionRemove = async () => {
    try {
      setDeleting(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/collections/${id}`,
        { withCredentials: true }
      );
      if (response.data.status === "success") {
        navigate("/admin/collections");
      }
    } catch (err) {
      console.error("Failed to delete collection:", err);
    } finally {
      setDeleting(false);
    }
  };

  // Products filtered by collectionSearch
  const displayedProducts = useMemo(() => {
    if (!data?.products || !Array.isArray(data.products)) return [];
    if (!collectionSearch.trim()) return data.products;
    const q = collectionSearch.toLowerCase().trim();
    return data.products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [data?.products, collectionSearch]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <AdminNav />

      {/* ================= EDIT COLLECTION MODAL ================= */}
      <EditCollection
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        collection={data}
        onSuccess={(updated) => {
          setData((prev) => ({
            ...prev,
            ...updated,
            products: updated.products || prev?.products || [],
            type: updated.type || prev?.type || [],
          }));
        }}
      />

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className="fixed inset-0"
            onClick={() => !deleting && setDeleteModalOpen(false)}
          ></div>
          <div className="relative z-10 bg-neutral-900 rounded-none p-6 md:p-8 max-w-sm w-full shadow-2xl border border-neutral-800 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-alert-line text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-white font-[panchang]">
              Delete Collection?
            </h3>
            <p className="text-xs text-neutral-400 mt-2 mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-white">{data?.name}</strong>? This action
              cannot be undone and will unlink all products.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-none border border-neutral-700 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition"
                style={{ borderRadius: 0 }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleCollectionRemove}
                className="flex-1 py-2.5 rounded-none bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition shadow disabled:opacity-50 inline-flex items-center justify-center gap-2"
                style={{ borderRadius: 0 }}
              >
                {deleting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i> Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD PRODUCT DRAWER ================= */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-neutral-900 border-l border-neutral-800 text-white shadow-2xl transition-transform duration-300 transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <h3 className="text-base font-bold text-white font-[panchang]">
              Add Products
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Search and attach products to {data?.name}
            </p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-950/30">
          <div className="relative">
            <input
              type="text"
              value={searchProductText}
              onChange={handleProductSearchChange}
              placeholder="Search products by title..."
              className="w-full pl-10 pr-9 py-2.5 bg-neutral-950 border border-neutral-800 rounded-none text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
              style={{ borderRadius: 0 }}
            />
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm"></i>
            {searchLoading ? (
              <i className="ri-loader-4-line animate-spin absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm"></i>
            ) : searchProductText ? (
              <button
                onClick={() => {
                  setSearchProductText("");
                  setFetchedProducts([]);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <i className="ri-close-line text-sm"></i>
              </button>
            ) : null}
          </div>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {searchLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500 text-xs">
              <i className="ri-loader-4-line text-2xl animate-spin mb-2 text-white"></i>
              <span>Searching products...</span>
            </div>
          ) : fetchedProducts.length > 0 ? (
            fetchedProducts.map((prod) => (
              <div
                key={prod._id}
                className="flex items-center justify-between p-3 rounded-none border border-neutral-800 hover:border-neutral-600 bg-neutral-950 transition group"
                style={{ borderRadius: 0 }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-14 bg-neutral-900 rounded-none overflow-hidden flex-shrink-0 border border-neutral-800">
                    {prod.imageLink ? (
                      <img
                        src={prod.imageLink}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] font-bold text-neutral-300 mt-0.5 font-mono">
                      ${prod.price}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={addingId === prod._id}
                  onClick={() => handleAddProduct(prod)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white text-black text-xs font-bold hover:bg-neutral-200 transition disabled:opacity-50 flex-shrink-0"
                  style={{ borderRadius: 0 }}
                >
                  {addingId === prod._id ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i> Adding
                    </>
                  ) : (
                    <>
                      <i className="ri-add-line"></i> Add
                    </>
                  )}
                </button>
              </div>
            ))
          ) : searchProductText ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <i className="ri-search-eye-line text-3xl mb-2"></i>
              <p className="text-xs font-medium text-neutral-400">No products found</p>
              <p className="text-[11px] text-neutral-600 mt-0.5">
                All matching products might already be in this collection.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-500">
              <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-3">
                <i className="ri-search-line text-xl text-neutral-400"></i>
              </div>
              <p className="text-xs font-medium text-neutral-300">
                Type above to search products
              </p>
              <p className="text-[11px] text-neutral-500 mt-1 max-w-[240px]">
                Search from your catalog to attach products to this collection.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= PAGE CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/admin/collections"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white uppercase tracking-wider transition"
          >
            <i className="ri-arrow-left-line"></i> Back to Collections
          </Link>

          <Link
            to={`/collections/${id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition"
          >
            <span>Preview on Storefront</span>
            <i className="ri-external-link-line"></i>
          </Link>
        </div>

        {loading ? (
          /* Skeleton Loader */
          <div className="space-y-6">
            <div className="w-full h-44 bg-neutral-900 border border-neutral-800 animate-pulse rounded-none"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-neutral-900 border border-neutral-800 animate-pulse rounded-none"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ================= COLLECTION HERO CARD ================= */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-none p-6 md:p-8 shadow-sm mb-10 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Left: Thumbnail and Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Thumbnail Image */}
                  <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-none overflow-hidden shadow-sm flex-shrink-0 border border-neutral-700 bg-neutral-950">
                    {data?.thumbnailImageLink ? (
                      <img
                        src={data.thumbnailImageLink}
                        alt={data.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 text-xs">
                        <i className="ri-image-line text-2xl mb-1"></i>
                        No Image
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditOpen(true)}
                      title="Change Image & Details"
                      className="absolute inset-0 bg-black/75 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-semibold transition duration-200"
                    >
                      <i className="ri-camera-line text-base mb-0.5"></i>
                      Change
                    </button>
                  </div>

                  {/* Title, Description & Tags */}
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="font-[panchang] font-black md:text-3xl text-2xl leading-tight text-white">
                        {data?.name}
                      </h1>
                      <span className="text-[11px] font-semibold uppercase tracking-wider bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-none border border-neutral-700">
                        {data?.products?.length || 0} Products
                      </span>
                    </div>

                    {data?.description && (
                      <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed font-light">
                        {data.description}
                      </p>
                    )}

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {data?.type?.length > 0 ? (
                        data.type.map((e) => (
                          <span
                            key={e._id || e.name}
                            className="text-xs capitalize bg-neutral-950 border border-neutral-700 text-neutral-300 px-3 py-0.5 rounded-none font-medium"
                          >
                            {e.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-neutral-500 italic">
                          No categories assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
                  <button
                    type="button"
                    onClick={() => setEditOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-none border border-neutral-700 bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700 transition shadow-sm"
                    style={{ borderRadius: 0 }}
                  >
                    <i className="ri-edit-line text-sm"></i>
                    Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-none bg-white text-black text-xs font-bold hover:bg-neutral-200 transition shadow-sm"
                    style={{ borderRadius: 0 }}
                  >
                    <i className="ri-add-line text-sm"></i>
                    Add Products
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    title="Delete Collection"
                    className="w-10 h-10 rounded-none border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition"
                    style={{ borderRadius: 0 }}
                  >
                    <i className="ri-delete-bin-line text-base"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* ================= PRODUCTS IN COLLECTION SECTION ================= */}
            <section className="bg-neutral-900/90 border border-neutral-800 rounded-none p-6 md:p-8 shadow-sm">
              {/* Section Header & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-800">
                <div>
                  <h2 className="text-lg font-bold text-white font-[panchang]">
                    Products in Collection
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Showing {displayedProducts.length} of {data?.products?.length || 0}{" "}
                    products attached to this collection
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search inside collection */}
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={collectionSearch}
                      onChange={(e) => setCollectionSearch(e.target.value)}
                      placeholder="Filter collection items..."
                      className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 rounded-none focus:outline-none focus:border-white transition"
                      style={{ borderRadius: 0 }}
                    />
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
                    {collectionSearch && (
                      <button
                        onClick={() => setCollectionSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        <i className="ri-close-line text-sm"></i>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-none bg-white text-black text-xs font-bold hover:bg-neutral-200 transition shadow-sm text-nowrap"
                    style={{ borderRadius: 0 }}
                  >
                    <i className="ri-add-line text-sm"></i>
                    Add More
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              {displayedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {displayedProducts.map((prod) => (
                    <Card
                      key={prod._id}
                      {...prod}
                      isAdmin={true}
                      handleRemove={handleProductRemove}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-neutral-800 bg-neutral-950/40 rounded-none">
                  <div className="w-14 h-14 bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 mb-3">
                    <i className="ri-inbox-line text-2xl"></i>
                  </div>
                  <h3 className="text-sm font-bold text-white font-[panchang]">
                    {collectionSearch
                      ? "No Matching Products"
                      : "No Products in Collection"}
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mt-1 mb-5">
                    {collectionSearch
                      ? `No products match "${collectionSearch}". Try another keyword or clear filter.`
                      : "Start building this collection by adding products from your inventory."}
                  </p>
                  {collectionSearch ? (
                    <button
                      type="button"
                      onClick={() => setCollectionSearch("")}
                      className="px-4 py-2 rounded-none bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition"
                      style={{ borderRadius: 0 }}
                    >
                      Clear Filter
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white text-black text-xs font-bold hover:bg-neutral-200 transition shadow"
                      style={{ borderRadius: 0 }}
                    >
                      <i className="ri-add-line"></i> Add Products
                    </button>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCollectionDetails;
