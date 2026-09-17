import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import Logo from "./Logo";
import SideBar from "./SideBar";
import { useCollection } from "./CollectionProvider";

const Navbar = ({ links, isAdmin, scrolledLimit, solid }) => {
  const collection = useCollection();
  const [link, setlink] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart count synchronization
  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const total = cart.reduce(
          (sum, item) => sum + (Number(item.quantity) || 1),
          0
        );
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  // User auth synchronization with backend and localStorage
  useEffect(() => {
    const syncUser = () => {
      try {
        const saved = localStorage.getItem("user");
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          { withCredentials: true }
        );
        if (response.data && response.data.status === "success" && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } catch {
        // Keep local user if offline or ignore
      }
    };

    fetchProfile();
    window.addEventListener("authUpdated", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("authUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("authUpdated"));
  };

  // Populate links
  useEffect(() => {
    if (isAdmin) {
      setlink(links || []);
    } else {
      const colLinks =
        collection?.data?.map((e) => ({
          name: e.name,
          link: `/collections/${e._id}`,
        })) || [];
      setlink([{ name: "Catalog", link: "/products" }, ...colLinks]);
    }
  }, [collection, isAdmin, links]);

  return (
    <>
      <div className="w-full duration-300 z-[11111] bg-black text-white border-b border-neutral-800 sticky top-0">
        <nav
          className={
            isAdmin
              ? "flex justify-between items-center px-4 sm:px-6 lg:px-10 py-3 relative"
              : "flex top-0 w-full justify-between items-center px-4 sm:px-6 lg:px-10 py-3 duration-300 relative"
          }
        >
          {/* Left section: Animated Double Hamburger + Desktop Links */}
          <div className="left flex items-center gap-5 w-auto md:w-[45%]">
            {/* Double Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
              className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition focus:outline-none cursor-pointer py-1 group"
            >
              <div className="flex flex-col justify-center gap-[5px] w-6 h-5 relative">
                <span
                  className={`block h-[2px] bg-white transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                      ? "w-6 translate-y-[3.5px] rotate-45"
                      : "w-6 group-hover:w-6"
                  }`}
                />
                <span
                  className={`block h-[2px] bg-white transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                      ? "w-6 -translate-y-[3.5px] -rotate-45"
                      : "w-4 self-start group-hover:w-6"
                  }`}
                />
              </div>
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest font-semibold text-neutral-300 group-hover:text-white transition">
                {isSidebarOpen ? "Close" : "Menu"}
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex text-[11px] uppercase items-center gap-6 lg:gap-8 tracking-wider">
              {link?.map((elem) => (
                <li
                  className="hoverer after:bg-white text-neutral-300 hover:text-white transition-colors"
                  key={elem.name}
                >
                  <Link to={elem.link}>{elem.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Center section: Logo */}
          <Link to={isAdmin ? "/admin" : "/"}>
            <div className="center text-xl font-[panchang] font-bold">
              <Logo invert={true} />
            </div>
          </Link>

          {/* Right section */}
          {isAdmin ? (
            <div className="right w-auto md:w-[45%] flex items-center justify-end gap-5">
              <Link
                to="/"
                className="text-xs uppercase tracking-wider text-neutral-300 hover:text-white transition hidden sm:inline-block"
              >
                View Store
              </Link>
            </div>
          ) : (
            <div className="right w-auto md:w-[45%] font-medium flex items-center justify-end gap-4 sm:gap-5">
              {/* Search */}
              <Link
                to="/products"
                title="Search Products"
                className="text-neutral-300 hover:text-white transition"
              >
                <i className="ri-search-line text-lg sm:text-xl"></i>
              </Link>

              {/* Shopping Bag */}
              <Link
                to="/cart"
                title="Shopping Bag"
                className="text-neutral-300 hover:text-white transition relative"
              >
                <i className="ri-shopping-bag-4-fill text-lg sm:text-xl"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User Profile / Login (Desktop) */}
              {user ? (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-300 hover:text-white transition cursor-pointer"
                  title="View Account Profile"
                >
                  <i className="ri-user-3-line text-sm"></i>
                  <span>{user.firstName || "Profile"}</span>
                </button>
              ) : (
                <Link
                  className="hidden sm:inline-block text-xs uppercase tracking-wider text-neutral-300 hover:text-white transition"
                  to={"/login"}
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Footer Style Sidebar */}
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        links={link}
        isAdmin={isAdmin}
        user={user}
        onLogout={handleLogout}
        cartCount={cartCount}
      />
    </>
  );
};

export default Navbar;
