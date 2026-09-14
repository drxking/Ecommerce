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
    <div className="bg-black px-10 md:pl-20  footer py-10 pt-20 text-white w-full ">
      <h1 className="uppercase text-5xl w-full text-center pb-20">The One & the Best</h1>
      <div className="grid lg:grid-cols-5 md:grid-cols-3 md:gap-3 gap-14">
        
        <div className="right text-xs flex flex-col uppercase ">
          
            <label htmlFor="email" className=" font-semibold  flex items-center justify-between md:pr-20 "><span className="underline underline-offset-8">Email</span> <i class="ri-arrow-right-long-line text-xl"></i></label>
          
          <input className="p-2 text-white bg-transparent  active:outline-none focus:outline-none" type="text" id="email" />
          
        </div>

        <div className="right text-xs uppercase ">
          <p className=" font-semibold pb-4  underline underline-offset-8">Get in Touch</p>
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
          <p className=" font-semibold pb-4  underline underline-offset-8">Collections</p>

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
          <p className=" font-semibold pb-4  underline underline-offset-8">Company</p>
          <a href="#">TSabinz</a>
        </div>


        <div className="right text-xs uppercase">
          <p className=" font-semibold pb-4  underline underline-offset-8">Social</p>

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
      <div className="  mt-10">
        <div className="w-full border-t border-gray-500 flex  justify-center py-1">
          <p className=" text-xs text-center">Copyright © tsabinz.official - 2026 <br /> All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
