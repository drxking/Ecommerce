import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import Logo from "./Logo";
import { useCollection } from "./CollectionProvider";

const Navbar = ({ links, isAdmin, scrolledLimit, solid }) => {
  const collection = useCollection();
  const [link, setlink] = useState([]);

  useEffect(() => {
    isAdmin
      ? ""
      : setlink(
          collection?.data?.map((e) => ({
            name: e.name,
            link: `/collection/${e._id}`,
          }))
        );
  }, [collection]);


  return (
    <div
      className={
        !solid
          ? " w-full duration-300 bg-white"
          : scrolledLimit
          ? "fixed w-full duration-300 z-[11111] bg-white"
          : "fixed z-[11111] text-white w-full duration-300"
      }
    >
      <nav
        className={
          isAdmin
            ? " flex  justify-between items-center px-5  lg:px-10 py-2 border-b border-gray-100"
            : " flex top-0 w-full justify-between items-center px-5  lg:px-10 py- duration-300 "
        }
      >
        <div className="left w-[45%] hidden md:flex">
          <ul className="flex text-[11px] uppercase items-center gap-8 tracking-wider">
            {link?.map((elem) => (
              <li key={elem.name}>
                {" "}
                <Link to={elem.link}>{elem.name}</Link>{" "}
              </li>
            ))}
          </ul>
        </div>
        <Link to={isAdmin ? "/admin" : "/"}>
          <div className="center text-xl  w-[10%] font-[panchang] font-bold">
            <Logo invert={!solid ? false : scrolledLimit ? false : true} />
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
            <Link className="text-xs uppercase" to={"/login"}>
              Login
            </Link>
          </div>
        )}
      </nav>
      <div
        className={
          isAdmin
            ? "no-scroller py-2 w-full flex md:hidden border-b border-gray-100 overflow-x-scroll"
            : "no-scroller py-2 w-full flex md:hidden overflow-x-scroll"
        }
      >
        <ul className="flex items-center uppercase  gap-1 font-medium px-5   ">
          {link?.map((elem) => (
            <li key={elem.name}>
              {" "}
              <Link className=" px-4 py-2  text-xs rounded-full" to={elem.link}>
                {elem.name}
              </Link>{" "}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
