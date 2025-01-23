import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import axios from "axios";
import { useProducts } from "../components/ProductsProvider";
import { Link } from "react-router-dom";

let links = [
  {
    name: "Men",
    link: "/men",
  },
  {
    name: "Women",
    link: "/women",
  },
  {
    name: "Kids",
    link: "/kids",
  },
  {
    name: "Featured",
    link: "/sale",
  },
];

const Home = () => {
  const [IsScrolled100px, setIsScrolled100px] = useState(false);
  const [collection, setCollection] = useState();

  async function collectionFetcher() {
    let response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/collections/three-collection`,
      {
        withCredentials: true,
      }
    );
    if (response) {
      setCollection(response.data.data);
    }
  }
  useEffect(() => {
    collectionFetcher();
  }, []);

  useEffect(() => {
    console.log(collection);
  }, [collection]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled100px(true);
      } else {
        setIsScrolled100px(false);
      }
    };

    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const products = useProducts();

  return (
    <div>
      <Navbar links={links} scrolledLimit={IsScrolled100px} solid={true} />
      <div className="hero w-full bg-[url(https://studio63.in/wp-content/uploads/2023/12/754A3993.webp)] flex flex-col items-center justify-center text-white uppercase   bg-cover bg-center h-screen">
       <p className="font-[panchang] text-6xl">Asthetic</p>
       <p className=" text-xs border-b border-white leading-none mt-2">shop</p>
      </div>

      <div className="w-full  py-4 flex-1  justify-start md:px-5 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4">
        {collection?.map((e, index) => (
          <Link
            to={`/collections/${e._id}`}
            className={
              index == 2
                ? "h-full relative  object-cover sm:col-span-2 md:col-span-1"
                : "h-full relative  sm:col-span-1 object-cover"
            }
          >
            <img
              className="h-full  sm:w-full brightness-[80%]"
              src={e.thumbnailImageLink}
              alt=""
            />
            <div className="absolute h-full w-full  top-0 flex items-center justify-center">
              <h2 className="text-white font-[panchang] text-3xl">{e.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
