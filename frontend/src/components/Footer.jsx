import React, { useState, useEffect } from "react";
import { useCollection } from "./CollectionProvider";
import { Link } from "react-router-dom";

const Footer = () => {
  let collection = useCollection();

  const [link, setlink] = useState([]);

  useEffect(() => {
    setlink(
      collection?.data?.map((e) => ({
        name: e.name,
        link: `${e._id}`,
      }))
    );
  }, [collection]);

  return (
    <div className="bg-black  py-10 pt-20 text-white w-full">
      <div className=" flex justify-around sm:flex-row flex-col gap-8 sm:gap-0 px-10">
        <div className="left">
          <div className="logo flex flex-col items-center">
            <img
              src="/tsabinz.png"
              className="invert border rounded-full h-20 w-20 object-cover"
              alt="Logo"
            />
            <p className="uppercase text-sm p-3">tsabinz.official</p>
          </div>
        </div>

        <div className="right text-xs uppercase">
          <p className="text-gray-400 font-semibold pb-2">Get in Touch</p>
          <ul className=" flex flex-col gap-2">
            <li className="hoverer">
              <Link>bussiness@tsabinz.com</Link>
            </li>
            <li className="hoverer">
              <Link>hello@tsabinz.com</Link>
            </li>
          </ul>
        </div>

        <div className="center text-xs uppercase">
          <p className="text-gray-400 font-semibold pb-2">Collections</p>

          <div className=" flex flex-col gap-2">
            {link?.map((e, index) => (
              <Link
                key={index}
                to={`/collections/${e.link}`}
                className="hoverer"
              >
                {e.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="right text-xs uppercase">
          <p className="text-gray-400 font-semibold pb-2">Social</p>

          <ul className=" flex flex-col gap-2">
            <li className="hoverer">
              <Link>Instagram</Link>
            </li>
            <li className="hoverer">
              <Link>TikTok</Link>
            </li>
            <li className="hoverer">
              <Link>Thread</Link>
            </li>

            <li className="hoverer">
              <Link>'X' Twitter</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="md:px-20 px-5  mt-10">
        <div className="w-full border-t border-gray-500 flex  justify-center py-1">
          <p className=" text-xs">Copyright © tsabinz.official - 2025 | All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
