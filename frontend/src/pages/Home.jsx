import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import Card from "../components/Card";

const HOMEPAGE_CACHE_KEY = "homepage-data-v1";

const readHomepageCache = () => {
  try {
    const cached = sessionStorage.getItem(HOMEPAGE_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const isBrowserReload = () => {
  const navigation = performance.getEntriesByType("navigation")[0];
  return navigation?.type === "reload";
};

const HomeInitialLoader = ({ isExiting }) => (
  <div className={`fixed inset-0 z-[99999] overflow-hidden ${isExiting ? "bg-transparent" : "bg-black"}`} aria-label="Loading homepage">
    <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-500 ${isExiting ? "opacity-0" : "opacity-100"}`}>
      <img src="/tsabinz.png" alt="Tsabinz" className="w-12 md:w-16 invert animate-pulse" />
    </div>
    <div className="absolute inset-0">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className={`absolute top-0 bottom-0 bg-black transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isExiting ? "-translate-y-full" : "translate-y-0"}`}
          style={{
            left: `calc(${index} * (100% / 9))`,
            width: "calc(100% / 9 + 1px)",
            borderLeft: index === 0 ? "none" : "1px solid #d1d5db33",
            transitionDelay: isExiting ? `${180 + index * 90}ms` : "0ms",
          }}
        />
      ))}
    </div>
  </div>
);

const Home = () => {
  const [cachedHomeData] = useState(readHomepageCache);
  const [isReload] = useState(isBrowserReload);
  const [IsScrolled100px, setIsScrolled100px] = useState(false);
  const [isDataReady, setIsDataReady] = useState(() => Boolean(cachedHomeData) && !isReload);
  const [showInitialLoader, setShowInitialLoader] = useState(() => !cachedHomeData || isReload);
  const [homeConfig, setHomeConfig] = useState(cachedHomeData?.homeConfig || null);
  const [orderedCollections, setOrderedCollections] = useState(cachedHomeData?.orderedCollections || []);
  const [featuredCollections, setFeaturedCollections] = useState(cachedHomeData?.featuredCollections || []);
  const [topProducts, setTopProducts] = useState(cachedHomeData?.topProducts || []);

  useEffect(() => {
    const fetchHomeData = async () => {
      // A route revisit in the same tab uses the cached snapshot. Browser
      // reloads intentionally fetch a new snapshot before revealing the page.
      if (cachedHomeData && !isReload) return;

      try {
        const [configRes, prodRes, collectionsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/home-config`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/products`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/collections`),
        ]);

        const config = configRes.data?.data || configRes.data;
        const collectionList = Array.isArray(collectionsRes.data?.data)
          ? collectionsRes.data.data
          : Array.isArray(collectionsRes.data)
          ? collectionsRes.data
          : [];
        const ordered = config?.orderedCollections?.length > 0
          ? config.orderedCollections
              .filter((i) => i && (i.collection || i.collect))
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((i) => i.collection || i.collect)
          : collectionList;
        const configuredCollections = Array.isArray(config?.topThreeCollections)
          ? config.topThreeCollections.filter(Boolean)
          : [];
        const featured = (configuredCollections.length ? configuredCollections : collectionList.slice(0, 3)).slice(0, 3);

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
        const products = (configuredProducts.length ? configuredProducts : prodList).slice(0, 4);
        const snapshot = {
          homeConfig: config || null,
          orderedCollections: ordered,
          featuredCollections: featured,
          topProducts: products,
        };

        setHomeConfig(snapshot.homeConfig);
        setOrderedCollections(snapshot.orderedCollections);
        setFeaturedCollections(snapshot.featuredCollections);
        setTopProducts(snapshot.topProducts);
        sessionStorage.setItem(HOMEPAGE_CACHE_KEY, JSON.stringify(snapshot));
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setIsDataReady(true);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (!isDataReady) return;
    const timer = window.setTimeout(() => setShowInitialLoader(false), 1800);
    return () => window.clearTimeout(timer);
  }, [isDataReady]);

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
      {showInitialLoader && <HomeInitialLoader isExiting={isDataReady} />}
      <Navbar scrolledLimit={IsScrolled100px} solid={true} />

      {/* 1. Hero Banner Video at Top */}
      <div className="hero relative w-screen h-screen flex flex-col items-center justify-center text-white uppercase overflow-hidden">
        <div className="w-full hero-anim overflow-hidden absolute top-0 left-0 h-full flex items-center justify-center">
          {homeConfig?.banner?.mediaLink ? (homeConfig.banner.mediaType === "image" ? (
            <img
              src={homeConfig.banner.mediaLink}
              alt={homeConfig?.banner?.title || "Store banner"}
              className="w-full h-full object-cover relative top-0 left-0"
            />
          ) : (
            <video
              key={homeConfig.banner.mediaLink}
              src={homeConfig.banner.mediaLink}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover relative top-0 left-0"
            />
          )) : <div className="w-full h-full bg-[radial-gradient(circle_at_50%_20%,#262626_0%,#0a0a0a_65%)]" />}

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
      {featuredCollections.length > 0 && (
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
            {featuredCollections.map((e, index) => (
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
