import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
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
  const [banners, setBanners] = useState([]);

  async function collectionFetcher() {
    let response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/collections/three-collection`,
      {
        withCredentials: true,
      }
    );
    if (response) {
      setCollection(response.data.data);
      setBanners(
        response.data.data.map((e) => ({
          bannerImageLink: e.bannerImageLink,
          name: e.name,
          id: e._id,
        }))
      );
    }
  }
  useEffect(() => {
    collectionFetcher();
  }, []);

  useEffect(() => {
    console.log(collection);
    console.log(banners);
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

  return (
    <div>
      <Navbar links={links} scrolledLimit={IsScrolled100px} solid={true} />
      <div className="hero relative w-full flex flex-col items-center justify-center text-white uppercase  h-screen">
        {banners?.map((e) => (
          <div className="w-full loader top-0 left-0 h-full absolute">
            <img
              src={e?.bannerImageLink}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        ))}
      </div>

      <div className="w-full  py-3 flex-1  justify-start md:px-5 gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-3">
        {collection?.map((e, index) => (
          <Link
            to={`/collections/${e._id}`}
            key={index}
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
              <h2 className="text-white font-[panchang] text-center text-3xl md:text-[2.5vw]">
                {e.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
