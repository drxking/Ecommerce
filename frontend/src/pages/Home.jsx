import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useCollection } from "../components/CollectionProvider";
import Footer from "../components/Footer";

const Home = () => {
  let collection = useCollection();
  const [IsScrolled100px, setIsScrolled100px] = useState(false);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    setBanners(
      collection?.data?.map((e) => ({
        bannerImageLink: e.bannerImageLink,
        name: e.name,
        id: e._id,
      }))
    );
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
      <Navbar scrolledLimit={IsScrolled100px} solid={true} />
      <div className="hero relative w-full flex flex-col items-center justify-center text-white uppercase  h-screen">
        <div
          className={`w-full hero-anim   absolute top-0 left-0 h-full flex items-center justify-center`}
        >
          <img
            src={banners ? banners[0]?.bannerImageLink : ""}
            className="w-full h-full object-cover relative top-0  left-0"
            alt={banners ? banners[0]?.bannerImageLink : ""}
          />
          <div className="absolute flex flex-col items-center">
            <h2 className=" font-[panchang] text-3xl  md:text-5xl">
              {banners ? banners[0]?.name : ""}
            </h2>
            <Link
              to={`/collections/${banners ? banners[0]?.id : ""}`}
              className="capitalize text-center border-b leading-5 text-sm"
            >
              Shop
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full  py-3 flex-1  justify-start md:px-5 gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-3">
        {collection?.data?.map((e, index) => (
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
              className="h-full  sm:w-full brightness-[80%] object-cover"
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
      <Footer />
    </div>
  );
};

export default Home;
