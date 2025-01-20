import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import axios from "axios";
import Loader from "../components/Loader";

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
  let [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetcher() {
      let product = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products`
      );
      setProducts(product.data);
      setIsLoading(false);
    }
    fetcher();
  }, []);

  return (
    <>
      <Navbar links={links}/>
      <div className="flex flex-col items-center sm:p-10 p-2">
        <h2 className="uppercase text-[14vw] mt-10 sm:mt-0 font-bold leading-none sm:text-5xl sm:font-medium text-center">
          Latest Clothing Collection
        </h2>
        <p className="text-sm text-gray-400 text-center mt-3">
          Find everything you need to look and feel your best, and shop the
          latest trending <br /> fashion and lifestyle products
        </p>
      </div>
      <div className="p-4 flex gap-8 justify-center flex-wrap ">
        {isLoading ? (
          <>
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
          </>
        ) : products ? (
          products?.map((e, index) => <Card key={index} {...e}></Card>)
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Home;
