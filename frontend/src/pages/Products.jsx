import React, { useEffect, useMemo, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Raw data from server
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedCollection, setSelectedCollection] = useState(searchParams.get("collection") || "all");
  const [pricePreset, setPricePreset] = useState("all"); // "all", "under-1500", "1500-2500", "above-2500", "custom"
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default"); // "default", "price-low", "price-high", "newest", "name-asc", "name-desc"

  // Drawer / Expanded filters toggle
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const catalogTopRef = useRef(null);

  // Fetch initial products, categories, and collections
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, typeRes, colRes] = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_BASE_URL}/products`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/types`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/collections`),
        ]);

        if (prodRes.status === "fulfilled") {
          const raw = prodRes.value.data;
          const list = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.products)
            ? raw.products
            : [];
          setProducts(list);
        } else {
          console.error("Failed to load products:", prodRes.reason);
        }

        if (typeRes.status === "fulfilled") {
          const typeData = typeRes.value.data;
          const typesList = Array.isArray(typeData?.data)
            ? typeData.data
            : Array.isArray(typeData)
            ? typeData
            : [];
          setCategories(typesList);
        } else {
          console.error("Failed to load types:", typeRes.reason);
        }

        if (colRes.status === "fulfilled") {
          const colData = colRes.value.data;
          const colList = Array.isArray(colData?.data)
            ? colData.data
            : Array.isArray(colData)
            ? colData
            : [];
          setCollections(colList);
        } else {
          console.error("Failed to load collections:", colRes.reason);
        }
      } catch (err) {
        console.error("Failed to load catalog data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  // Sync URL search params if query parameter exists
  useEffect(() => {
    const qParam = searchParams.get("q");
    if (qParam !== null && qParam !== searchQuery) {
      setSearchQuery(qParam);
    }
    const catParam = searchParams.get("category");
    if (catParam !== null && catParam !== selectedCategory) {
      setSelectedCategory(catParam);
    }
    const colParam = searchParams.get("collection");
    if (colParam !== null && colParam !== selectedCollection) {
      setSelectedCollection(colParam);
    }
  }, [searchParams]);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategory,
    selectedCollection,
    pricePreset,
    customMinPrice,
    customMaxPrice,
    inStockOnly,
    sortBy,
    itemsPerPage,
  ]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const desc = p.description?.toLowerCase() || "";
        const typeName =
          typeof p.type === "object"
            ? p.type?.name?.toLowerCase() || ""
            : "";
        const colName =
          typeof p.collect === "object"
            ? p.collect?.name?.toLowerCase() || ""
            : "";
        return (
          name.includes(q) ||
          desc.includes(q) ||
          typeName.includes(q) ||
          colName.includes(q)
        );
      });
    }

    // 2. Category / Type Filter
    if (selectedCategory !== "all") {
      const activeCat = categories.find(
        (c) => c._id === selectedCategory || c.name?.toLowerCase() === selectedCategory.toLowerCase()
      );
      list = list.filter((p) => {
        const t = p.type;
        if (t) {
          if (typeof t === "object") {
            if (
              t._id === selectedCategory ||
              t.name?.toLowerCase() === selectedCategory.toLowerCase()
            ) {
              return true;
            }
          } else if (t === selectedCategory) {
            return true;
          }
        }
        if (activeCat && Array.isArray(activeCat.products)) {
          return activeCat.products.some((pid) => (pid?._id || pid) === p._id);
        }
        return false;
      });
    }

    // 3. Collection Filter
    if (selectedCollection !== "all") {
      const activeCol = collections.find(
        (c) => c._id === selectedCollection || c.name?.toLowerCase() === selectedCollection.toLowerCase()
      );
      list = list.filter((p) => {
        const col = p.collect || p.collection;
        if (col) {
          if (typeof col === "object") {
            if (
              col._id === selectedCollection ||
              col.name?.toLowerCase() === selectedCollection.toLowerCase()
            ) {
              return true;
            }
          } else if (col === selectedCollection) {
            return true;
          }
        }
        if (activeCol && Array.isArray(activeCol.products)) {
          return activeCol.products.some((cp) => (cp?._id || cp) === p._id);
        }
        return false;
      });
    }

    // 4. Price Preset Filter
    if (pricePreset === "under-1500") {
      list = list.filter((p) => Number(p.price) < 1500);
    } else if (pricePreset === "1500-2500") {
      list = list.filter((p) => Number(p.price) >= 1500 && Number(p.price) <= 2500);
    } else if (pricePreset === "above-2500") {
      list = list.filter((p) => Number(p.price) > 2500);
    } else if (pricePreset === "custom") {
      const min = customMinPrice !== "" ? Number(customMinPrice) : -Infinity;
      const max = customMaxPrice !== "" ? Number(customMaxPrice) : Infinity;
      list = list.filter((p) => {
        const pr = Number(p.price) || 0;
        return pr >= min && pr <= max;
      });
    }

    // 5. In-Stock Filter
    if (inStockOnly) {
      list = list.filter((p) => {
        if (p.stock !== undefined) return Number(p.stock) > 0;
        if (p.remainingStock !== undefined) return Number(p.remainingStock) > 0;
        return true;
      });
    }

    // 6. Sorting
    if (sortBy === "price-low") {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b._id || "").localeCompare(a._id || ""));
    }

    return list;
  }, [
    products,
    categories,
    collections,
    searchQuery,
    selectedCategory,
    selectedCollection,
    pricePreset,
    customMinPrice,
    customMaxPrice,
    inStockOnly,
    sortBy,
  ]);

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Check if any filter is actively applied
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedCollection !== "all" ||
    pricePreset !== "all" ||
    customMinPrice !== "" ||
    customMaxPrice !== "" ||
    inStockOnly;

  // Clear all filters helper
  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCollection("all");
    setPricePreset("all");
    setCustomMinPrice("");
    setCustomMaxPrice("");
    setInStockOnly(false);
    setSortBy("default");
    setSearchParams({});
  };

  // Page navigation helper with smooth scroll
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (catalogTopRef.current) {
      catalogTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Generate page numbers with smart ellipsis
  const getPaginationPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-white selection:text-black">
      <div>
        <Navbar solid={true} />

        {/* ================= HERO CATALOG BANNER ================= */}
        <section className="relative border-b border-neutral-800 bg-neutral-950/80 py-12 md:py-16 px-4 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold mb-2 font-[panchang]">
                The Archive
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-[panchang] font-black uppercase tracking-tight text-white">
                Catalog
              </h1>
              <p className="text-xs md:text-sm text-neutral-400 mt-2 max-w-xl font-light">
                Explore our full line of curated luxury collections, signature fragrances, and streetwear pieces.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="text-xs uppercase tracking-wider font-mono text-neutral-300 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-none"
                style={{ borderRadius: 0 }}
              >
                {totalItems} {totalItems === 1 ? "Product" : "Products"}
              </span>
            </div>
          </div>
        </section>

        {/* Scroll anchor target */}
        <div ref={catalogTopRef} className="scroll-mt-4" />

        {/* ================= MAIN CATALOG BODY ================= */}
        <main className="max-w-7xl mx-auto px-4 md:px-12 py-8">
          {/* Top Filter Bar: Search, Category, Collection, Sort & Filter Drawer Toggle */}
          <div className="border-b border-neutral-800 pb-6 mb-6 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full lg:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 rounded-none focus:outline-none focus:border-white transition"
                  style={{ borderRadius: 0 }}
                />
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                )}
              </div>

              {/* Filter Controls Strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs border border-neutral-800 bg-neutral-950 text-neutral-200 rounded-none focus:outline-none focus:border-white cursor-pointer uppercase tracking-wider font-medium"
                  style={{ borderRadius: 0 }}
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Collection Dropdown */}
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="px-3 py-2 text-xs border border-neutral-800 bg-neutral-950 text-neutral-200 rounded-none focus:outline-none focus:border-white cursor-pointer uppercase tracking-wider font-medium"
                  style={{ borderRadius: 0 }}
                >
                  <option value="all">All Collections</option>
                  {collections.map((col) => (
                    <option key={col._id} value={col._id}>
                      {col.name}
                    </option>
                  ))}
                </select>

                {/* Price Preset Dropdown */}
                <select
                  value={pricePreset}
                  onChange={(e) => setPricePreset(e.target.value)}
                  className="px-3 py-2 text-xs border border-neutral-800 bg-neutral-950 text-neutral-200 rounded-none focus:outline-none focus:border-white cursor-pointer uppercase tracking-wider font-medium"
                  style={{ borderRadius: 0 }}
                >
                  <option value="all">All Prices</option>
                  <option value="under-1500">Under ₹1,500</option>
                  <option value="1500-2500">₹1,500 – ₹2,500</option>
                  <option value="above-2500">Above ₹2,500</option>
                  <option value="custom">Custom Range</option>
                </select>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs border border-neutral-800 bg-neutral-950 text-neutral-200 rounded-none focus:outline-none focus:border-white cursor-pointer uppercase tracking-wider font-medium"
                  style={{ borderRadius: 0 }}
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="name-asc">Alphabetical: A–Z</option>
                  <option value="name-desc">Alphabetical: Z–A</option>
                </select>

                {/* In Stock Toggle Button */}
                <button
                  type="button"
                  onClick={() => setInStockOnly((prev) => !prev)}
                  className={`px-3.5 py-2 text-xs uppercase tracking-wider font-medium border rounded-none transition flex items-center gap-1.5 ${
                    inStockOnly
                      ? "bg-white text-black border-white font-bold"
                      : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  <i className={inStockOnly ? "ri-checkbox-circle-fill text-black" : "ri-checkbox-blank-circle-line"}></i>
                  In Stock Only
                </button>
              </div>
            </div>

            {/* Custom Price Range Inputs (shown when custom price preset is selected) */}
            {pricePreset === "custom" && (
              <div className="flex items-center gap-3 pt-2 bg-neutral-950/60 p-3 border border-neutral-800">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Price Range:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">₹</span>
                  <input
                    type="number"
                    value={customMinPrice}
                    onChange={(e) => setCustomMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-20 px-2 py-1 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-none focus:outline-none focus:border-white"
                    style={{ borderRadius: 0 }}
                  />
                  <span className="text-neutral-500 text-xs">–</span>
                  <span className="text-xs text-neutral-500">₹</span>
                  <input
                    type="number"
                    value={customMaxPrice}
                    onChange={(e) => setCustomMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-20 px-2 py-1 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-none focus:outline-none focus:border-white"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>
            )}

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
                  Active Filters:
                </span>

                {searchQuery && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-white text-xs rounded-none"
                    style={{ borderRadius: 0 }}
                  >
                    <span>"{searchQuery}"</span>
                    <button onClick={() => setSearchQuery("")} className="hover:text-red-400">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}

                {selectedCategory !== "all" && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-white text-xs rounded-none capitalize"
                    style={{ borderRadius: 0 }}
                  >
                    <span>
                      Category: {categories.find((c) => c._id === selectedCategory)?.name || selectedCategory}
                    </span>
                    <button onClick={() => setSelectedCategory("all")} className="hover:text-red-400">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}

                {selectedCollection !== "all" && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-white text-xs rounded-none capitalize"
                    style={{ borderRadius: 0 }}
                  >
                    <span>
                      Collection: {collections.find((c) => c._id === selectedCollection)?.name || selectedCollection}
                    </span>
                    <button onClick={() => setSelectedCollection("all")} className="hover:text-red-400">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}

                {pricePreset !== "all" && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-white text-xs rounded-none"
                    style={{ borderRadius: 0 }}
                  >
                    <span>
                      {pricePreset === "under-1500" && "Under ₹1,500"}
                      {pricePreset === "1500-2500" && "₹1,500 – ₹2,500"}
                      {pricePreset === "above-2500" && "Above ₹2,500"}
                      {pricePreset === "custom" && `₹${customMinPrice || 0} – ₹${customMaxPrice || "Any"}`}
                    </span>
                    <button onClick={() => { setPricePreset("all"); setCustomMinPrice(""); setCustomMaxPrice(""); }} className="hover:text-red-400">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-white text-xs rounded-none"
                    style={{ borderRadius: 0 }}
                  >
                    <span>In Stock Only</span>
                    <button onClick={() => setInStockOnly(false)} className="hover:text-red-400">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs uppercase font-semibold text-neutral-400 hover:text-white underline underline-offset-4 ml-1"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>

          {/* ================= PRODUCTS GRID ================= */}
          {loading ? (
            /* Loading Skeletons with Square Frames */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="flex flex-col items-center animate-pulse">
                  <div className="w-full aspect-square bg-neutral-900 border border-neutral-800"></div>
                  <div className="h-4 w-3/4 bg-neutral-900 mt-4"></div>
                  <div className="h-3 w-1/3 bg-neutral-900 mt-2"></div>
                  <div className="h-8 w-28 bg-neutral-900 mt-3.5"></div>
                </div>
              ))}
            </div>
          ) : currentProducts.length > 0 ? (
            <div>
              {/* Product Cards Grid with Homepage Layout */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {currentProducts.map((product) => (
                  <Card key={product._id} {...product} />
                ))}
              </div>

              {/* ================= PAGINATION CONTROLS ================= */}
              <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Product range count */}
                <div className="text-xs text-neutral-400 font-mono tracking-wider">
                  Showing <span className="text-white font-semibold">{totalItems > 0 ? startIndex + 1 : 0}</span>–
                  <span className="text-white font-semibold">{endIndex}</span> of{" "}
                  <span className="text-white font-semibold">{totalItems}</span> products
                </div>

                {/* Numbered Page Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    {/* Prev button */}
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-3 py-2 text-xs border border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white hover:border-white disabled:opacity-30 disabled:hover:border-neutral-800 rounded-none transition uppercase tracking-wider"
                      style={{ borderRadius: 0 }}
                      title="Previous Page"
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>

                    {/* Page Numbers */}
                    {getPaginationPages().map((page, idx) =>
                      page === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-xs text-neutral-600 select-none">
                          ...
                        </span>
                      ) : (
                        <button
                          key={`page-${page}`}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 text-xs font-semibold uppercase tracking-wider transition rounded-none flex items-center justify-center ${
                            currentPage === page
                              ? "bg-white text-black font-bold shadow"
                              : "border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700"
                          }`}
                          style={{ borderRadius: 0 }}
                        >
                          {page}
                        </button>
                      )
                    )}

                    {/* Next button */}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-3 py-2 text-xs border border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white hover:border-white disabled:opacity-30 disabled:hover:border-neutral-800 rounded-none transition uppercase tracking-wider"
                      style={{ borderRadius: 0 }}
                      title="Next Page"
                    >
                      <i className="ri-arrow-right-s-line"></i>
                    </button>
                  </div>
                )}

                {/* Items Per Page Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    Per Page:
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-800 text-white rounded-none focus:outline-none focus:border-white cursor-pointer uppercase tracking-wider"
                    style={{ borderRadius: 0 }}
                  >
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                    <option value={16}>16</option>
                    <option value={24}>24</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* ================= EMPTY STATE ================= */
            <div
              className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-neutral-800 bg-neutral-950/40 rounded-none my-6"
              style={{ borderRadius: 0 }}
            >
              <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center mb-4">
                <i className="ri-shopping-bag-3-line text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold font-[panchang] uppercase tracking-wide text-white mb-2">
                No Products Found
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mb-6 font-light">
                {hasActiveFilters
                  ? "We couldn't find any products matching your active filters. Try adjusting search terms or resetting filters."
                  : "There are currently no products available in the catalog."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-none transition shadow"
                  style={{ borderRadius: 0 }}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
