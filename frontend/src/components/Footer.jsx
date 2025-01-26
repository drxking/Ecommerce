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
    <div className="bg-black flex justify-around min-h-56 py-10 text-white w-full">

      <div className="left">
        <div className="logo flex flex-col items-center">
          <img src="/tsabinz.png" className="invert border rounded-full h-20 w-20 object-cover" alt="Logo" />
          <p className="uppercase text-sm p-3">tsabinz.official</p>
        </div>
      </div>

      <div className="center flex flex-col gap-1 text-xs uppercase">
        {link?.map((e) => (
          <Link to={`/collections/${e.link}`} className="hoverer">{e.name}</Link>
        ))}
      </div>

      <div className="right text-xs uppercase">
        <ul className=" flex flex-col gap-1">
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
            <Link>Youtube</Link>
          </li>
          <li className="hoverer">
            <Link>'X' Twitter</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
