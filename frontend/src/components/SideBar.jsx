import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const SideBar = ({
  isOpen,
  onClose,
  links = [],
  isAdmin = false,
  user = null,
  onLogout = () => {},
  cartCount = 0,
}) => {
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[11115] transition-opacity duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-sm sm:max-w-md bg-[#0a0a0a] text-white border-r border-neutral-800 z-[11120] transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto no-scroller shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Top Header inside Sidebar with Animated Double Hamburger Close */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md z-10">
          <Link to={isAdmin ? "/admin" : "/"} onClick={onClose}>
            <div className="font-[panchang] font-bold text-xl">
              <Logo invert={true} />
            </div>
          </Link>

          {/* Animated Double Hamburger (crossed state to close) */}
          <button
            onClick={onClose}
            className="w-10 h-10 flex flex-col justify-center items-center gap-[5px] cursor-pointer focus:outline-none group p-2 text-neutral-300 hover:text-white transition"
            aria-label="Close menu"
          >
            <span className="block w-6 h-[2px] bg-white transition-all duration-300 rotate-45 translate-y-[3.5px]" />
            <span className="block w-6 h-[2px] bg-white transition-all duration-300 -rotate-45 -translate-y-[3.5px]" />
          </button>
        </div>

        {/* Content sections in Mobile Footer Style */}
        <div className="p-6 sm:p-8 flex flex-col gap-8 flex-1">
          {/* Tagline / Header */}
          <div className="border-b border-neutral-800 pb-5">
            <h2 className="uppercase text-lg sm:text-xl font-bold tracking-wider text-white">
              The One &amp; the Best
            </h2>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400 mt-1">
              {isAdmin ? "Administrative Control Panel" : "Exclusive Modern Streetwear"}
            </p>
          </div>

          {/* Navigation / Collections Section */}
          <div className="flex flex-col uppercase text-xs">
            <p className="font-semibold pb-4 underline underline-offset-8 text-neutral-200 tracking-wider">
              {isAdmin ? "Admin Navigation" : "Collections"}
            </p>
            <ul className="flex flex-col gap-3">
              {links?.map((elem) => (
                <li key={elem.name}>
                  <Link
                    to={elem.link}
                    onClick={onClose}
                    className="hoverer text-neutral-300 hover:text-white transition flex items-center justify-between py-1 tracking-wider"
                  >
                    <span>{elem.name}</span>
                    <i className="ri-arrow-right-line text-sm opacity-50"></i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account / Profiles Section */}
          {!isAdmin && (
            <div className="flex flex-col uppercase text-xs border-t border-neutral-800/80 pt-6">
              <p className="font-semibold pb-4 underline underline-offset-8 text-neutral-200 tracking-wider">
                {user ? "Account Profile" : "Account"}
              </p>

              {user ? (
                <div className="flex flex-col gap-4">
                  {/* User Profile Card */}
                  <div className="p-3.5 bg-neutral-900/90 border border-neutral-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-sm text-white shrink-0 uppercase">
                      {user.firstName
                        ? user.firstName[0].toUpperCase()
                        : user.email
                        ? user.email[0].toUpperCase()
                        : "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-xs uppercase tracking-wider truncate">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName || ""}`.trim()
                          : "Member"}
                      </p>
                      <p className="text-[10px] text-neutral-400 lowercase truncate font-sans">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-[9px] uppercase tracking-widest text-emerald-400">
                        ● Signed In
                      </span>
                    </div>
                  </div>

                  {/* Profile Actions */}
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        to="/cart"
                        onClick={onClose}
                        className="hoverer text-neutral-300 hover:text-white transition flex items-center justify-between py-1 tracking-wider"
                      >
                        <span className="flex items-center gap-2">
                          <i className="ri-shopping-bag-4-line text-sm"></i> Shopping Bag
                        </span>
                        {cartCount > 0 && (
                          <span className="bg-white text-black font-bold text-[10px] px-2 py-0.5">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onLogout();
                          onClose();
                        }}
                        className="hoverer text-red-400 hover:text-red-300 transition flex items-center gap-2 py-1 tracking-wider text-xs uppercase cursor-pointer w-full text-left"
                      >
                        <i className="ri-logout-box-r-line text-sm"></i>
                        <span>Log Out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="hoverer text-neutral-300 hover:text-white transition flex items-center justify-between py-1 tracking-wider"
                    >
                      <span className="flex items-center gap-2">
                        <i className="ri-user-3-line text-sm"></i> Sign In / Login
                      </span>
                      <i className="ri-arrow-right-line text-sm opacity-50"></i>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      onClick={onClose}
                      className="hoverer text-neutral-300 hover:text-white transition flex items-center justify-between py-1 tracking-wider"
                    >
                      <span className="flex items-center gap-2">
                        <i className="ri-user-add-line text-sm"></i> Create Account
                      </span>
                      <i className="ri-arrow-right-line text-sm opacity-50"></i>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cart"
                      onClick={onClose}
                      className="hoverer text-neutral-300 hover:text-white transition flex items-center justify-between py-1 tracking-wider"
                    >
                      <span className="flex items-center gap-2">
                        <i className="ri-shopping-bag-4-line text-sm"></i> Shopping Bag
                      </span>
                      {cartCount > 0 && (
                        <span className="bg-white text-black font-bold text-[10px] px-2 py-0.5">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Quick Search */}
          <div className="flex flex-col uppercase text-xs border-t border-neutral-800/80 pt-6">
            <Link
              to="/products"
              onClick={onClose}
              className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition"
            >
              <span className="flex items-center gap-2 tracking-wider">
                <i className="ri-search-line text-sm"></i> Search Products
              </span>
              <i className="ri-arrow-right-line text-sm"></i>
            </Link>
          </div>

          {/* Get in Touch */}
          <div className="flex flex-col uppercase text-xs border-t border-neutral-800/80 pt-6">
            <p className="font-semibold pb-4 underline underline-offset-8 text-neutral-200 tracking-wider">
              Get in Touch
            </p>
            <ul className="flex flex-col gap-2.5">
              <li className="hoverer">
                <a
                  href="mailto:bussiness@tsabinz.com"
                  className="text-neutral-400 hover:text-white lowercase font-sans text-xs tracking-normal"
                >
                  bussiness@tsabinz.com
                </a>
              </li>
              <li className="hoverer">
                <a
                  href="mailto:hello@tsabinz.com"
                  className="text-neutral-400 hover:text-white lowercase font-sans text-xs tracking-normal"
                >
                  hello@tsabinz.com
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col uppercase text-xs border-t border-neutral-800/80 pt-6">
            <p className="font-semibold pb-4 underline underline-offset-8 text-neutral-200 tracking-wider">
              Company
            </p>
            <span className="text-neutral-400 tracking-wider">TSabinz Official</span>
          </div>

          {/* Social */}
          <div className="flex flex-col uppercase text-xs border-t border-neutral-800/80 pt-6">
            <p className="font-semibold pb-4 underline underline-offset-8 text-neutral-200 tracking-wider">
              Social
            </p>
            <ul className="flex flex-col gap-2.5">
              <li className="hoverer text-neutral-400 hover:text-white transition">
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li className="hoverer text-neutral-400 hover:text-white transition">
                <a href="https://tiktok.com" target="_blank" rel="noreferrer">
                  TikTok
                </a>
              </li>
              <li className="hoverer text-neutral-400 hover:text-white transition">
                <a href="https://threads.net" target="_blank" rel="noreferrer">
                  Thread
                </a>
              </li>
              <li className="hoverer text-neutral-400 hover:text-white transition">
                <a href="https://x.com" target="_blank" rel="noreferrer">
                  'X' Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="p-6 border-t border-neutral-800 bg-[#070707] text-center">
          <p className="text-[11px] text-neutral-400 uppercase tracking-wider leading-relaxed">
            Copyright &copy; tsabinz.official - 2026 <br />
            All Rights Reserved
          </p>
        </div>
      </aside>
    </>
  );
};

export default SideBar;