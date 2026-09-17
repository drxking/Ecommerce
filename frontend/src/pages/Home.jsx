import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useCollection } from "../components/CollectionProvider";
import Footer from "../components/Footer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import Card from "../components/Card";

const Home = () => {
  let collection = useCollection();
  const [IsScrolled100px, setIsScrolled100px] = useState(false);
  const [iSloaded, setISloaded] = useState(false);
  const [homeConfig, setHomeConfig] = useState(null);
  const [orderedCollections, setOrderedCollections] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  let loader = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [configRes, prodRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/home-config`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/products`),
        ]);

        const config = configRes.data?.data || configRes.data;
        if (config) {
          setHomeConfig(config);
          if (config.orderedCollections?.length > 0) {
            const sorted = config.orderedCollections
              .filter((i) => i && (i.collection || i.collect))
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((i) => i.collection || i.collect);
            setOrderedCollections(sorted);
          } else {
            // Fallback to all collections
            const colsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/collections`);
            const colList = Array.isArray(colsRes.data?.data)
              ? colsRes.data.data
              : Array.isArray(colsRes.data)
              ? colsRes.data
              : [];
            setOrderedCollections(colList);
          }
        }

        const rawProds = prodRes.data;
        const prodList = Array.isArray(rawProds)
          ? rawProds
          : Array.isArray(rawProds?.data)
          ? rawProds.data
          : Array.isArray(rawProds?.products)
          ? rawProds.products
          : [];
        const configuredProducts = Array.isArray(config?.featuredProducts)
          ? config.featuredProducts.filter(Boolean)
          : [];
        setTopProducts((configuredProducts.length ? configuredProducts : prodList).slice(0, 4));
      } catch (err) {
        console.error("Failed to load home data:", err);
      }
    };
    fetchHomeData();
  }, []);

  useGSAP(() => {
    if (iSloaded) {
      gsap.to(loader.current, {
        opacity: 0,
        duration: 0.7,
      });
    }
  }, [iSloaded]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled100px(true);
      } else {
        setIsScrolled100px(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
      <Navbar scrolledLimit={IsScrolled100px} solid={true} />

      {/* 1. Hero Banner Video at Top */}
      <div className="hero relative w-screen h-screen flex flex-col items-center justify-center text-white uppercase overflow-hidden">
        <div className="w-full hero-anim overflow-hidden absolute top-0 left-0 h-full flex items-center justify-center">
          {(homeConfig?.banner?.mediaType || "video") === "image" ? (
            <img
              src={homeConfig?.banner?.mediaLink || homeConfig?.banner?.videoLink}
              alt={homeConfig?.banner?.title || "Store banner"}
              className="w-full h-full object-cover relative top-0 left-0"
            />
          ) : (
            <video
              key={homeConfig?.banner?.mediaLink || homeConfig?.banner?.videoLink || "/hero.webm"}
              src={homeConfig?.banner?.mediaLink || homeConfig?.banner?.videoLink || "/hero.webm"}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover relative top-0 left-0"
            />
          )}

          {/* Overlay Title & Redirect Link */}
          {(homeConfig?.banner?.title || (homeConfig?.banner?.redirectLink && homeConfig?.banner?.redirectLink !== "/")) && (
            <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center text-center p-4">
              {homeConfig?.banner?.title && (
                <h1 className="text-white font-[panchang] font-black text-3xl sm:text-5xl md:text-6xl tracking-wider uppercase mb-4">
                  {homeConfig.banner.title}
                </h1>
              )}
              {homeConfig?.banner?.redirectLink && homeConfig.banner.redirectLink !== "/" && (
                <Link
                  to={homeConfig.banner.redirectLink}
                  className="mt-2 bg-white text-black hover:bg-neutral-200 font-semibold px-7 py-3 text-xs md:text-sm tracking-widest uppercase transition-all duration-300 shadow-lg rounded-none"
                  style={{ borderRadius: 0 }}
                >
                  Explore Collection
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Order-wise Collections (h-screen w-screen, title at bottom center, description, and non-rounded Explore button) */}
      {orderedCollections.map((col, idx) => (
        <div
          key={col._id || idx}
          className="relative w-screen h-screen overflow-hidden flex flex-col justify-end items-center"
        >
          {col.thumbnailImageLink ? (
            <img
              src={col.thumbnailImageLink}
              alt={col.name}
              className="absolute inset-0 w-full h-full object-cover brightness-[75%]"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center text-neutral-600">
              No image
            </div>
          )}

          {/* Gradient overlay for bottom readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

          {/* Bottom Center Content */}
          <div className="relative z-10 flex flex-col items-center text-center text-white pb-14 md:pb-20 px-4 max-w-3xl">
            <h2 className="text-white font-[panchang] font-black text-3xl sm:text-5xl md:text-6xl tracking-wider uppercase leading-tight">
              {col.name}
            </h2>
            {col.description && (
              <p className="text-white/85 text-sm md:text-base mt-3 max-w-xl font-light tracking-wide">
                {col.description}
              </p>
            )}
            <Link
              to={`/collections/${col._id}`}
              className="mt-6 bg-white text-black hover:bg-neutral-200 font-semibold px-8 py-3.5 text-xs md:text-sm tracking-widest uppercase transition-all duration-300 rounded-none shadow-xl"
              style={{ borderRadius: 0 }}
            >
              Explore Collection
            </Link>
          </div>
        </div>
      ))}

      {/* 3. Featured Products (configured in admin, maximum 4) */}
      {topProducts.length > 0 && (
        <section className="w-full px-4 md:px-24 py-16 bg-[#0a0a0a] border-t border-neutral-800">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-[panchang] font-bold uppercase tracking-tight text-white">
                Featured Products
              </h2>
              <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium mt-1">Selected Highlights</p>
            </div>
            <Link to="/products" className="text-xs md:text-sm font-semibold text-neutral-300 hover:text-white flex items-center gap-1 uppercase tracking-wider rounded-none transition">
              View All Products <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-2">
            {topProducts.map((product) => <Card key={product._id} {...product} />)}
          </div>
        </section>
      )}

      {/* 4. Top Three Collections Section (Featured Collection) */}
      {collection?.data?.length > 0 && (
        <section className="w-full bg-[#0a0a0a] pt-16 pb-6 border-t border-neutral-800">
          <div className="flex items-center justify-between px-4 md:px-12 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-[panchang] font-bold uppercase tracking-tight text-white">
                Featured Collection
              </h2>
              <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium mt-1">
                Curated Selection
              </p>
            </div>
            
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {collection.data.map((e, index) => (
              <Link
                to={`/collections/${e._id}`}
                key={index}
                className={
                  index === 2
                    ? "h-full relative object-cover sm:col-span-2 group md:col-span-1 overflow-hidden"
                    : "h-full relative sm:col-span-1 object-cover group overflow-hidden"
                }
              >
                <img
                  className="h-full sm:w-full w-full brightness-[75%] group-hover:scale-105 object-cover duration-500"
                  src={e.thumbnailImageLink}
                  alt=""
                />
                <div className="absolute h-full w-full top-0 flex flex-col items-center justify-center p-4">
                  <h2 className="text-white font-[panchang] hoverer text-center text-3xl md:text-[2.5vw]">
                    {e.name}
                  </h2>
                  {e.description && (
                    <p className="text-white/80 text-xs mt-2 text-center max-w-xs line-clamp-2">
                      {e.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. Footer */}
      <Footer />
    </div>
  );
};

export default Home;
