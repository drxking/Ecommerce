import React, { useEffect, useMemo, useState } from "react";
import AdminNav from "../components/AdminNav";
import AddProducts from "../components/AddProducts";
import EditProduct from "../components/EditProduct";
import axios from "axios";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const AdminProducts = () => {
  const [addProductsToggle, setAddProductsToggle] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const toggleProductsToggle = () => {
    setAddProductsToggle(!addProductsToggle);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`);
      setProducts(response.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/products/${deleteTarget._id}`,
        { withCredentials: true }
      );
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.vendor?.name?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <AdminNav />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="fixed inset-0"
            onClick={() => !deleting && setDeleteTarget(null)}
          ></div>
          <div className="relative z-10 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-delete-bin-line text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold font-[panchang] text-white">
              Delete Product?
            </h3>
            <p className="text-xs text-neutral-400 mt-2 mb-6 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white">"{deleteTarget.name}"</strong>? This action
              cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-none border border-neutral-700 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition"
                style={{ borderRadius: 0 }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-none bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition shadow disabled:opacity-50 inline-flex items-center justify-center gap-2"
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

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-neutral-800">
          <div>
            <h1 className="font-[panchang] font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
              {addProductsToggle ? "Add New Product" : "Product Inventory"}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              {addProductsToggle
                ? "Fill out product details, pricing, sizes, and upload product imagery."
                : `Manage catalog products (${products.length} total items in store).`}
            </p>
          </div>

          <button
            onClick={toggleProductsToggle}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition rounded-none self-start sm:self-auto shadow-lg"
            style={{ borderRadius: 0 }}
          >
            {addProductsToggle ? (
              <>
                <i className="ri-arrow-left-line"></i> Back to Products
              </>
            ) : (
              <>
                <i className="ri-add-line"></i> Add Product
              </>
            )}
          </button>
        </div>

        {addProductsToggle ? (
          <div className="pt-6">
            <AddProducts
              onProductAdded={() => {
                setAddProductsToggle(false);
                fetchProducts();
              }}
            />
          </div>
        ) : (
          <div className="pt-8">
            {/* Search & Stats Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-800">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter products by name or vendor..."
                  className="w-full pl-10 pr-9 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 rounded-none text-xs focus:outline-none focus:border-white transition"
                  style={{ borderRadius: 0 }}
                />
                <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                )}
              </div>

              <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div
                    key={n}
                    className="bg-neutral-900 border border-neutral-800 p-3 space-y-3 animate-pulse"
                  >
                    <div className="w-full aspect-[3/4] bg-neutral-800"></div>
                    <div className="h-4 w-3/4 bg-neutral-800 rounded"></div>
                    <div className="h-3 w-1/2 bg-neutral-800 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-neutral-800 bg-neutral-900/40 p-8 my-6">
                <div className="w-14 h-14 rounded-full bg-neutral-800 text-neutral-500 flex items-center justify-center mx-auto mb-4">
                  <i className="ri-inbox-line text-2xl"></i>
                </div>
                <h3 className="text-base font-bold font-[panchang] text-white">
                  {searchQuery ? "No Matching Products" : "No Products In Inventory"}
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-6">
                  {searchQuery
                    ? `No products matched "${searchQuery}". Try a different search term.`
                    : "Your inventory is currently empty. Click 'Add Product' to start building your catalog."}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-white rounded-none"
                    style={{ borderRadius: 0 }}
                  >
                    Clear Filter
                  </button>
                ) : (
                  <button
                    onClick={toggleProductsToggle}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 rounded-none shadow"
                    style={{ borderRadius: 0 }}
                  >
                    Add First Product
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-neutral-900/90 border border-neutral-800 hover:border-neutral-600 transition-all duration-300 flex flex-col justify-between group rounded-none relative"
                    style={{ borderRadius: 0 }}
                  >
                    {/* Image Box */}
                    <div className="w-full aspect-[3/4] relative overflow-hidden bg-neutral-950">
                      {product.imageLink ? (
                        <img
                          src={product.imageLink}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                          No Image
                        </div>
                      )}

                      {/* Top Action Buttons */}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Link
                          to={`/products/${product._id}`}
                          target="_blank"
                          title="Preview Product"
                          className="bg-black/80 hover:bg-black text-white p-1.5 rounded-full text-xs transition backdrop-blur-sm"
                        >
                          <i className="ri-external-link-line"></i>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(product)}
                          className="bg-neutral-800 hover:bg-white hover:text-black text-white p-1.5 rounded-full text-xs transition backdrop-blur-sm shadow"
                          title="Update Product"
                        >
                          <i className="ri-pencil-line"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full text-xs transition shadow"
                          title="Delete Product"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>

                      {/* Stock Pill */}
                      {product.stock !== undefined && (
                        <span
                          className={`absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider backdrop-blur-sm ${
                            product.stock > 0
                              ? "bg-black/75 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-950/80 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="p-3 flex flex-col flex-1 justify-between">
                      <div>
                        {product.vendor && (
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 truncate">
                            {product.vendor.name}
                          </p>
                        )}
                        <h3 className="font-semibold text-xs md:text-sm text-white truncate mt-0.5">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="font-bold text-xs md:text-sm text-white">
                            ₹ {Number(product.price || 0).toLocaleString()}
                          </span>
                          {product.comparedPrice && Number(product.comparedPrice) > Number(product.price) && (
                            <span className="text-[10px] text-neutral-500 line-through">
                              ₹ {Number(product.comparedPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setEditingProduct(product)}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-[10px] font-semibold uppercase tracking-wider rounded-none transition flex items-center gap-1"
                          style={{ borderRadius: 0 }}
                        >
                          <i className="ri-pencil-line"></i> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Update Product Modal */}
      {editingProduct && (
        <EditProduct
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;