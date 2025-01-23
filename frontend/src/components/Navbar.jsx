import React from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import Logo from "./Logo";

const Navbar = ({ links, isAdmin }) => {
  return (
    <>
      <nav className="text-xs flex justify-between items-center px-5  lg:px-10 py-2 border-b border-gray-100">
        <div className="left w-[45%] hidden md:flex">
          <ul className="flex text-xs items-center gap-8 tracking-wider">
            {links.map((elem) => (
              <li key={elem.name}>
                {" "}
                <Link to={elem.link}>{elem.name}</Link>{" "}
              </li>
            ))}
          </ul>
        </div>
        <Link to={(isAdmin)?"/admin":"/"}>
          <div className="center text-xl  w-[10%] font-[panchang] font-bold">
            <Logo />
          </div>
        </Link>
        {isAdmin ? (
          ""
        ) : (
          <div className="right w-[45%] font-medium flex items-center justify-end gap-5 ">
            <Link>
              <i className="ri-search-line text-xl"></i>
            </Link>
            <Link>
              <i className="ri-shopping-bag-4-fill text-xl"></i>
            </Link>
            <Link className="text-xs" to={"/login"}>Login</Link>
          </div>
        )}
      </nav>
      <div className="no-scroller py-2 w-full flex md:hidden border-b border-gray-100 overflow-x-scroll">
        <ul className="flex items-center gap-1 font-medium px-5   ">
          {links.map((elem) => (
            <li key={elem.name}>
              {" "}
              <Link
                className=" px-4 py-2 text-gray-600 text-xs rounded-full"
                to={elem.link}
              >
                {elem.name}
              </Link>{" "}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
