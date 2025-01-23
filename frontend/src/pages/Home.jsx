import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import axios from "axios";
import Loader from "../components/Loader";
import { useProducts } from "../components/ProductsProvider";

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
  const products = useProducts();


  return (
    <>
      <Navbar links={links} />
      <div className="flex flex-col items-center sm:p-10 p-2">
        <h2 className="uppercase text-[14vw] font-[panchang] font-[900] mt-10 sm:mt-0  leading-none sm:text-6xl sm:font-medium text-center">
          Latest Clothing Collection
        </h2>
        <p className="text-sm text-gray-400 text-center mt-3">
          Find everything you need to look and feel your best, and shop the
          latest trending <br /> fashion and lifestyle products
        </p>
      </div>
      <div className="p-4 flex gap-8 justify-center flex-wrap ">
        {products ? (
          products?.map((e, index) => <Card key={index} {...e}></Card>)
        ) : (
          <>
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
          </>
        )}
      </div>
    </>
  );
};

export default Home;
