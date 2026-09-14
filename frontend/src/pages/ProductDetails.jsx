import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Card from "../components/Card";
import "remixicon/fonts/remixicon.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product data and related products
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [prodRes, allRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/products`),
        ]);

        const prod = prodRes.data;
        setProduct(prod);
        setActiveImage(prod?.imageLink || "");
        if (prod?.size && Array.isArray(prod.size) && prod.size.length > 0) {
          setSelectedSize(prod.size[0]);
        }

        if (Array.isArray(allRes.data)) {
          setRelatedProducts(allRes.data.filter((p) => p._id !== id).slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const cartKey = `${product._id}_${selectedSize || "default"}`;
      const existingIdx = cart.findIndex(
        (item) => item.cartKey === cartKey || (item._id === product._id && item.selectedSize === selectedSize)
      );
      if (existingIdx > -1) {
        cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + quantity;
      } else {
        cart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          imageLink: activeImage || product.imageLink,
          selectedSize: selectedSize || "",
          quantity: quantity,
          cartKey,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Combine main image + otherImageLink for gallery
  const allImages = React.useMemo(() => {
    if (!product) return [];
    const imgs = [];
    if (product.imageLink) imgs.push(product.imageLink);
    if (Array.isArray(product.otherImageLink)) {
      product.otherImageLink.forEach((img) => {
        if (img && !imgs.includes(img)) imgs.push(img);
      });
    }
    return imgs;
  }, [product]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between">
      <div>
        <Navbar solid={true} />

        {loading ? (
          /* Skeleton loader */
          <div className="max-w-7xl mx-auto px-4 md:px-12 py-10">
            <div className="h-4 w-48 bg-neutral-900 animate-pulse rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="w-full aspect-[3/4] bg-neutral-900 animate-pulse"></div>
              <div className="space-y-6">
                <div className="h-4 w-24 bg-neutral-900 animate-pulse rounded"></div>
                <div className="h-10 w-3/4 bg-neutral-900 animate-pulse rounded"></div>
                <div className="h-8 w-1/3 bg-neutral-900 animate-pulse rounded"></div>
                <div className="h-20 w-full bg-neutral-900 animate-pulse rounded"></div>
                <div className="h-12 w-full bg-neutral-900 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        ) : !product ? (
          <div className="py-32 text-center">
            <h2 className="text-2xl font-bold font-[panchang]">Product Not Found</h2>
            <Link
              to="/"
              className="mt-4 inline-block bg-white text-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-none"
              style={{ borderRadius: 0 }}
            >
              Back to Storefront
            </Link>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-12">
            {/* Breadcrumb navigation */}
            <nav className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest mb-8 font-medium">
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
              <span>/</span>
              {product.collection && (
                <>
                  <Link
                    to={`/collections/${product.collection._id || product.collection}`}
                    className="hover:text-white transition"
                  >
                    {product.collection.name || "Collection"}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-white truncate max-w-[200px]">
                {product.name}
              </span>
            </nav>

            {/* Product Details Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
              {/* Left Column: Image Showcase (7 cols) */}
              <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
                {/* Thumbnails Gallery Strip */}
                {allImages.length > 1 && (
                  <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scroller flex-shrink-0">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(img)}
                        className={`w-16 h-20 md:w-20 md:h-24 overflow-hidden border transition-all rounded-none flex-shrink-0 bg-neutral-950 ${
                          activeImage === img
                            ? "border-white brightness-105"
                            : "border-neutral-800 opacity-60 hover:opacity-100"
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        <img
                          src={img}
                          alt={`${product.name} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image Container */}
                <div className="flex-1 w-full aspect-[3/4] overflow-hidden bg-neutral-950 border border-neutral-800 relative group rounded-none">
                  <img
                    src={activeImage || product.imageLink}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-white border border-white/15">
                    TSABINZ EXCLUSIVE
                  </div>
                </div>
              </div>

              {/* Right Column: Product Meta & Purchase Controls (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  {/* Vendor Info & Stock Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    {product.vendor ? (
                      <div className="flex items-center gap-2">
                        {product.vendor.imageLink && (
                          <img
                            src={product.vendor.imageLink}
                            alt={product.vendor.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        )}
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          {product.vendor.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Official Collection
                      </span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-medium text-emerald-400">
                        {product.stock > 0
                          ? `In Stock (${product.stock})`
                          : "In Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h1 className="text-2xl md:text-4xl font-[panchang] font-black uppercase tracking-tight text-white mt-4 leading-tight">
                    {product.name}
                  </h1>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-2xl md:text-3xl font-bold font-mono text-white">
                      ₹ {Number(product.price || 0).toLocaleString()}
                    </span>
                    {product.comparedPrice && Number(product.comparedPrice) > Number(product.price) && (
                      <span className="text-base text-neutral-500 line-through font-mono">
                        ₹ {Number(product.comparedPrice).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div className="mt-5 pt-5 border-t border-neutral-800">
                      <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-light">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {/* Sizes Selector */}
                  {product.size && Array.isArray(product.size) && product.size.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-neutral-800">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          Select Size
                        </span>
                        <span className="text-[11px] text-neutral-500 uppercase tracking-widest">
                          Standard Fit
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.size.map((sz, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedSize(sz)}
                            className={`min-w-12 h-10 px-3 text-xs font-semibold uppercase tracking-wider transition-all rounded-none ${
                              selectedSize === sz
                                ? "bg-white text-black border border-white"
                                : "bg-neutral-900 border border-neutral-800 text-white hover:border-neutral-500"
                            }`}
                            style={{ borderRadius: 0 }}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity & Add to Cart Controls */}
                  <div className="mt-8 pt-6 border-t border-neutral-800 space-y-4">
                    <div className="flex items-center gap-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-800 bg-neutral-900 h-12 px-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-full text-neutral-400 hover:text-white transition flex items-center justify-center text-base"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-xs font-mono font-bold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-full text-neutral-400 hover:text-white transition flex items-center justify-center text-base"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`flex-1 h-12 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-none flex items-center justify-center gap-2 ${
                          addedToCart
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-black hover:bg-neutral-200"
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        {addedToCart ? (
                          <>
                            <i className="ri-check-line text-base"></i> Added to Cart
                          </>
                        ) : (
                          <>
                            <i className="ri-shopping-bag-line text-sm"></i> Add to Cart
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition rounded-none"
                      style={{ borderRadius: 0 }}
                    >
                      Buy It Now
                    </button>
                  </div>

                  {/* Value Badges */}
                  <div className="mt-8 pt-6 border-t border-neutral-800 space-y-2.5 text-xs text-neutral-400">
                    <div className="flex items-center gap-2.5">
                      <i className="ri-truck-line text-sm text-white"></i>
                      <span>Complimentary express delivery on orders over ₹ 2,999</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <i className="ri-shield-check-line text-sm text-white"></i>
                      <span>100% Authenticity guaranteed directly from artisan vendors</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <i className="ri-arrow-go-back-line text-sm text-white"></i>
                      <span>Hassle-free 30-day return policy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products Recommendation Section */}
            {relatedProducts.length > 0 && (
              <section className="mt-20 pt-16 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl md:text-2xl font-[panchang] font-bold uppercase tracking-tight text-white">
                      You Might Also Like
                    </h2>
                    <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">
                      Curated from the same catalog
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center gap-1"
                  >
                    View All <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {relatedProducts.map((p) => (
                    <Card key={p._id} {...p} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
