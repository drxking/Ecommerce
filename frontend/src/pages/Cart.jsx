import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "remixicon/fonts/remixicon.css";

const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_SHIPPING_FEE = 199;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  const loadCart = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(Array.isArray(stored) ? stored : []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    window.scrollTo(0, 0);

    const handleCartUpdate = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  const saveCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (index, delta) => {
    const updated = [...cartItems];
    const currentQty = Number(updated[index].quantity) || 1;
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      updated[index].quantity = newQty;
      saveCart(updated);
    }
  };

  const handleRemoveItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + price * qty;
  }, 0);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = subtotal === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shipping;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const amountNeededForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between">
      <div>
        <Navbar solid={true} />

        <main className="max-w-7xl mx-auto px-4 md:px-12 py-10 md:py-14">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <nav className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest mb-3">
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
                <span>/</span>
                <span className="text-white">Shopping Bag</span>
              </nav>
              <h1 className="text-2xl md:text-3xl font-[panchang] font-black uppercase tracking-tight text-white">
                Your Shopping Bag
              </h1>
            </div>
            {cartItems.length > 0 && (
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                {cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)} items
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="mt-4 text-xs uppercase tracking-widest text-neutral-400">
                Loading Bag...
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty State */
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5 text-neutral-400">
                <i className="ri-shopping-bag-line text-2xl"></i>
              </div>
              <h2 className="text-lg md:text-xl font-[panchang] uppercase font-bold text-white mb-2">
                Your Bag Is Currently Empty
              </h2>
              <p className="text-xs text-neutral-400 max-w-sm mb-8 font-light">
                Discover our latest luxury streetwear drops and essential collections to build your aesthetic.
              </p>
              <Link
                to="/products"
                className="bg-white text-black hover:bg-neutral-200 text-xs font-semibold uppercase tracking-wider px-8 py-3 transition rounded-none"
                style={{ borderRadius: 0 }}
              >
                Explore Catalog
              </Link>
            </div>
          ) : (
            /* Non-Empty Cart Layout */
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Cart Items List (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free shipping progress alert */}
                <div className="bg-neutral-900/60 border border-neutral-800 p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="uppercase tracking-wider text-neutral-300 font-medium">
                      {isFreeShipping ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <i className="ri-check-double-line"></i> You unlocked Complimentary Express Shipping!
                        </span>
                      ) : (
                        <span>
                          Add <span className="text-white font-bold font-mono">₹ {amountNeededForFreeShipping.toLocaleString()}</span> more for free express shipping
                        </span>
                      )}
                    </span>
                    <span className="text-neutral-500 font-mono text-[11px]">
                      {progressToFreeShipping}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${progressToFreeShipping}%` }}
                    ></div>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-neutral-800/80 border-t border-b border-neutral-800">
                  {cartItems.map((item, idx) => {
                    const price = Number(item.price) || 0;
                    const qty = Number(item.quantity) || 1;
                    const lineTotal = price * qty;

                    return (
                      <div
                        key={item.cartKey || `${item._id}_${idx}`}
                        className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        {/* Product Image & Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <Link
                            to={`/products/${item._id}`}
                            className="w-20 h-20 bg-neutral-950 border border-neutral-800 overflow-hidden flex-shrink-0"
                          >
                            <img
                              src={item.imageLink}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </Link>

                          <div className="space-y-1">
                            <Link
                              to={`/products/${item._id}`}
                              className="text-xs md:text-sm font-[panchang] uppercase font-bold text-white hover:text-neutral-300 transition line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            {item.selectedSize && (
                              <p className="text-[11px] uppercase tracking-wider text-neutral-400">
                                Size: <span className="text-white font-medium">{item.selectedSize}</span>
                              </p>
                            )}
                            <p className="text-xs font-mono text-neutral-300">
                              ₹ {price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Controls: Stepper, Line Total, Remove */}
                        <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                          {/* Stepper */}
                          <div className="flex items-center border border-neutral-800 bg-neutral-900 h-9 px-1">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(idx, -1)}
                              className="w-7 h-full text-neutral-400 hover:text-white transition flex items-center justify-center text-sm"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(idx, 1)}
                              className="w-7 h-full text-neutral-400 hover:text-white transition flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-right font-mono font-bold text-sm min-w-[90px]">
                            ₹ {lineTotal.toLocaleString()}
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-neutral-500 hover:text-red-400 transition p-1"
                            title="Remove item"
                          >
                            <i className="ri-delete-bin-line text-base"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition underline underline-offset-4"
                  >
                    Clear Bag
                  </button>
                  <Link
                    to="/products"
                    className="text-xs uppercase tracking-wider text-neutral-300 hover:text-white transition flex items-center gap-1.5"
                  >
                    <i className="ri-arrow-left-line"></i> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary (4 cols) */}
              <div className="lg:col-span-4">
                <div className="bg-neutral-900/50 border border-neutral-800 p-6 space-y-6">
                  <h2 className="text-sm font-[panchang] uppercase tracking-wider font-bold text-white pb-3 border-b border-neutral-800">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-neutral-300">
                      <span>Subtotal</span>
                      <span className="font-mono text-white font-medium">
                        ₹ {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-neutral-300">
                      <span>Estimated Delivery</span>
                      <span className="font-mono text-white font-medium">
                        {isFreeShipping ? (
                          <span className="text-emerald-400 uppercase text-[11px] font-bold">
                            FREE
                          </span>
                        ) : (
                          `₹ ${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex justify-between items-baseline">
                      <span className="text-sm font-semibold uppercase tracking-wider text-white">
                        Estimated Total
                      </span>
                      <span className="text-xl font-bold font-mono text-white">
                        ₹ {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert("Checkout integration placeholder - Thank you for testing!")}
                    className="w-full py-3.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest transition rounded-none flex items-center justify-center gap-2"
                    style={{ borderRadius: 0 }}
                  >
                    <i className="ri-lock-line"></i> Proceed to Checkout
                  </button>

                  <div className="pt-4 border-t border-neutral-800/80 space-y-2 text-[11px] text-neutral-500">
                    <div className="flex items-center gap-2">
                      <i className="ri-shield-check-line text-neutral-400"></i>
                      <span>Guaranteed safe and encrypted checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-refresh-line text-neutral-400"></i>
                      <span>Free 30-day hassle-free returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
