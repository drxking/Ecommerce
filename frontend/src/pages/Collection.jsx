import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "remixicon/fonts/remixicon.css";

const Collection = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled100px, setIsScrolled100px] = useState(false);

  // Search, filter, and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const fetchCollection = async () => {
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
      console.error("Failed to load collection:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled100px(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    if (!data?.products || !Array.isArray(data.products)) return [];

    let list = [...data.products];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Filter by selected category/type
    if (selectedType !== "all") {
      list = list.filter((p) => {
        if (!p.type) return false;
        if (typeof p.type === "object") {
          return p.type._id === selectedType || p.type.name === selectedType;
        }
        return p.type === selectedType;
      });
    }

    // Sort
    if (sortBy === "price-low") {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [data?.products, searchQuery, selectedType, sortBy]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between">
      <div>
        <Navbar scrolledLimit={isScrolled100px} solid={true} />

        {loading ? (
          /* ================= SKELETON LOADING STATE ================= */
          <div className="w-full">
            {/* Hero Skeleton */}
            <div className="w-full h-80 md:h-[450px] bg-neutral-950 animate-pulse relative flex flex-col justify-end p-6 md:p-14">
              <div className="max-w-2xl space-y-4">
                <div className="h-4 w-36 bg-neutral-800 rounded"></div>
                <div className="h-10 md:h-14 w-72 md:w-96 bg-neutral-800 rounded"></div>
                <div className="h-4 w-60 md:w-80 bg-neutral-800 rounded"></div>
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-20 bg-neutral-800 rounded-full"></div>
                  <div className="h-6 w-24 bg-neutral-800 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="max-w-7xl mx-auto px-4 md:px-12 py-10">
              <div className="flex justify-between items-center pb-6 mb-8 border-b border-neutral-800">
                <div className="h-5 w-40 bg-neutral-800 rounded"></div>
                <div className="h-9 w-48 bg-neutral-800 rounded"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="border border-neutral-800 p-3 space-y-3 animate-pulse bg-neutral-900/50">
                    <div className="w-full aspect-[3/4] bg-neutral-800"></div>
                    <div className="h-4 w-3/4 bg-neutral-800 rounded"></div>
                    <div className="h-3 w-1/2 bg-neutral-800 rounded"></div>
                    <div className="h-4 w-1/3 bg-neutral-800 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ================= LOADED CONTENT ================= */
          <div className="w-full">
            {/* 1. Hero Showcase Banner */}
            <section className="relative w-full h-[380px] md:h-[460px] overflow-hidden bg-black flex flex-col justify-end">
              {/* Background Image */}
              {data?.thumbnailImageLink ? (
                <img
                  src={data.thumbnailImageLink}
                  alt={data.name}
                  className="absolute inset-0 w-full h-full object-cover brightness-[70%]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800" />
              )}

              {/* Dark Gradient Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {/* Hero Content */}
              <div className="relative z-10 max-w-7xl w-full mx-auto px-4 md:px-12 pb-10 md:pb-12 text-white">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest mb-3 font-medium">
                  <Link to="/" className="hover:text-white transition">
                    Home
                  </Link>
                  <span>/</span>
                  <span className="hover:text-white transition">
                    Collections
                  </span>
                  <span>/</span>
                  <span className="text-white font-semibold truncate max-w-[200px]">
                    {data?.name}
                  </span>
                </nav>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-[panchang] font-black uppercase tracking-tight text-white">
                  {data?.name}
                </h1>

                {data?.description && (
                  <p className="mt-3 text-sm md:text-base text-neutral-300 max-w-2xl leading-relaxed font-light">
                    {data.description}
                  </p>
                )}

                {/* Tags & Product Count Badge */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
                  <span className="text-xs uppercase tracking-wider font-semibold bg-white text-black px-3.5 py-1 rounded-none shadow">
                    {data?.products?.length || 0} Products
                  </span>
                  {data?.type?.map((t) => (
                    <span
                      key={t._id || t.name}
                      className="text-xs uppercase tracking-wider font-medium bg-black/60 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-none"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Main Content & Controls */}
            <main className="max-w-7xl mx-auto px-4 md:px-12 py-10 md:py-14">
              {/* Filter & Sort Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-800">
                {/* Left: Product count & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 text-nowrap">
                    Showing {filteredProducts.length} of {data?.products?.length || 0} Items
                  </span>

                  <div className="relative w-full max-w-xs">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search in this collection..."
                      className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 rounded-none focus:outline-none focus:border-white transition"
                      style={{ borderRadius: 0 }}
                    />
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                      >
                        <i className="ri-close-line text-sm"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Category filter pills & Sort dropdown */}
                <div className="flex items-center gap-3 self-end md:self-auto">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider hidden sm:inline">
                      Sort:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 text-xs border border-neutral-800 bg-neutral-900 text-neutral-200 rounded-none focus:outline-none focus:border-white cursor-pointer uppercase tracking-wider font-medium"
                      style={{ borderRadius: 0 }}
                    >
                      <option value="default">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name-asc">Alphabetical: A-Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((prod) => (
                    <Card key={prod._id} {...prod} />
                  ))}
                </div>
              ) : (
                /* Empty state when no products found */
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-neutral-800 bg-neutral-900/30 rounded-none my-6">
                  <div className="w-14 h-14 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center mb-4">
                    <i className="ri-shopping-bag-3-line text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-bold font-[panchang] uppercase text-white mb-1">
                    No Products Found
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mb-6">
                    {searchQuery
                      ? `No products matched your search "${searchQuery}". Try a different keyword or reset filters.`
                      : "There are currently no products in this collection."}
                  </p>
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="bg-white text-black hover:bg-neutral-200 text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded-none transition"
                      style={{ borderRadius: 0 }}
                    >
                      Clear Search
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="bg-white text-black hover:bg-neutral-200 text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded-none transition"
                      style={{ borderRadius: 0 }}
                    >
                      Back to Home
                    </Link>
                  )}
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Collection;
