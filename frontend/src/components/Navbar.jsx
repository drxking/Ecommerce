import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import Logo from "./Logo";
import { useCollection } from "./CollectionProvider";

const Navbar = ({ links, isAdmin, scrolledLimit, solid }) => {
  const collection = useCollection();
  const [link, setlink] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const total = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
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

  useEffect(() => {
    if (isAdmin) {
      setlink(links);
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
    <div className="w-screen duration-300 z-[11111] bg-black text-white border-b border-neutral-800">
      <nav
        className={
          isAdmin
            ? "flex justify-between items-center px-5 lg:px-10 py-3"
            : "flex top-0 w-full justify-between items-center px-5 lg:px-10 py-3 duration-300"
        }
      >
        <div className="left w-[45%] hidden md:flex">
          <ul className="flex text-[11px] uppercase items-center gap-8 tracking-wider">
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
        <Link to={isAdmin ? "/admin" : "/"}>
          <div className="center text-xl w-[10%] font-[panchang] font-bold">
            <Logo invert={true} />
          </div>
        </Link>
        {isAdmin ? (
          ""
        ) : (
          <div className="right w-[45%] font-medium flex items-center justify-end gap-5">
            <Link to="/products" title="Search Products" className="text-neutral-300 hover:text-white transition">
              <i className="ri-search-line text-xl"></i>
            </Link>
            <Link to="/cart" title="Shopping Bag" className="text-neutral-300 hover:text-white transition relative">
              <i className="ri-shopping-bag-4-fill text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <Link className="text-xs uppercase tracking-wider text-neutral-300 hover:text-white transition" to={"/login"}>
              Login
            </Link>
          </div>
        )}
      </nav>
      <div
        className="no-scroller py-2 w-full flex md:hidden border-t border-neutral-800/80 overflow-x-scroll"
      >
        <ul className="flex items-center uppercase gap-1 font-medium px-5">
          {link?.map((elem) => (
            <li key={elem.name}>
              <Link
                className="px-3.5 py-1.5 whitespace-nowrap text-xs text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-none tracking-wider"
                style={{ borderRadius: 0 }}
                to={elem.link}
              >
                {elem.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
