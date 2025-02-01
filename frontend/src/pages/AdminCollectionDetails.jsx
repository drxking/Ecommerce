import React, { useEffect, useRef, useState } from "react";
import AdminNav from "../components/AdminNav";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";

const AdminCollectionDetails = () => {
  const [data, setData] = useState();
  const { id } = useParams();
  const [addCollectionTriggered, setAddCollectionTriggered] = useState(false);

  const [fetchedProducts, setfetchedProducts] = useState([]);

  let panel = useRef(null);
  let products = useRef();

  async function fetchOneCollectionn() {
    let response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/collections/${id}`,
      {
        withCredentials: true,
      }
    );
    if (response.data.status == "success") {
      setData(response.data.data);
    }
  }

  useEffect(() => {
    fetchOneCollectionn();
  }, []);

  useGSAP(() => {
    if (!addCollectionTriggered) {
      gsap.to(panel.current, {
        opacity: 0,
        duration: 0.3,
        pointerEvents: "none",
      });
    } else {
      gsap.to(panel.current, {
        opacity: 1,
        duration: 0.3,
        pointerEvents: "auto",
      });
    }
  }, [addCollectionTriggered]);

  function handleAddCollectionTrigger() {
    if (!addCollectionTriggered) {
      setAddCollectionTriggered(true);
    }
  }
  function handleCloseCollectionTrigger(e) {
    if (addCollectionTriggered) {
      setAddCollectionTriggered(false);
      products.current.value = "";
      setfetchedProducts([]);
    }
  }

  let timeout1;
  async function handleProduct() {
    clearTimeout(timeout1);
    let text = products.current.value;
    if (text.trim() === "") return setfetchedProducts([]);
    timeout1 = setTimeout(async () => {
      let response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products/search?product=${text}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status == "success") {
        const filteredCurrentArray = response?.data?.data?.filter(
          (currentItem) =>
            !data?.products?.some(
              (prevItem) => prevItem._id === currentItem._id
            )
        );
        setfetchedProducts(filteredCurrentArray);
      } else {
        setfetchedProducts([]);
      }
    }, 400);
  }

  async function handleAddProduct(e) {
    let response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/collections/${id}/${e}`,
      {
        withCredentials: true,
      }
    );
    if (response.data.status == "success") {
      setData((prevData) => ({
        ...prevData, // spread the previous data object
        products: [...prevData.products, fetchedProducts.find(item => item._id == e)],
      }));
    }
  }

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <AdminNav />
      <main className="md:px-20 px-5 p-5 pt-10 relative">
        <div className="flex items-center justify-between">
          <h1 className="font-[panchang] font-semibold md:font-semibold md:text-3xl text-2xl leading-none">
            {data?.name} Collection
          </h1>
          <button
            onClick={handleAddCollectionTrigger}
            className="bg-[url(/mask2.webp)] text-nowrap bg-cover bg-no-repeat py-2 px-4 rounded-full text-sm font-semibold text-white"
          >
            Add Product
          </button>
        </div>
        <div className="tags flex flex-wrap gap-2 py-2">
          {data?.type.map((e) => (
            <p
              key={e.name}
              className="text-xs capitalize bg-[#101720] text-white px-3 py-1 rounded-full"
            >
              {e.name}
            </p>
          ))}
        </div>
        <div className="flex gap-6 flex-wrap mt-10">
          {data?.products.map((e,index) => (
            <Card key={index} {...e} />
          ))}
        </div>
        <div
          ref={panel}
          className="fixed bg-black/30 opacity-0 pointer-events-none p-5 items-center top-0 h-full w-full right-0 flex justify-end"
        >
          <div
            onClick={handleCloseCollectionTrigger}
            className=" h-full w-full absolute -z-10"
          ></div>
          <div className="sm:w-[350px] w-full flex flex-col rounded-2xl h-[80%] bg-white p-5 backdrop-blur-md backdrop-brightness-90   ">
            <div className=" flex items-center justify-end">
              <i
                onClick={handleCloseCollectionTrigger}
                className="ri-close-line text-2xl cursor-pointer"
              ></i>
            </div>
            <p className="text-xl font-[panchang]">
              Add Product to {data?.name} Collection
            </p>
            <form className="py-3  relative flex flex-col gap-3">
              <input
                onChange={handleProduct}
                ref={products}
                type="text"
                placeholder="Search 'Products' "
                className="p-2 duration-500 bg-gray-100 border border-gray-300 w-full  focus:outline-none rounded-lg text-sm"
              />
            </form>

            <div className=" h-full w-full grid grid-cols-3 grid-rows-2 gap-3">
              {fetchedProducts.map((prod) => (
                <div
                  key={prod.name}
                  onClick={() => handleAddProduct(prod._id)}
                  className="relative w-full cursor-pointer  flex py-2 justify-center items-end overflow-hidden"
                >
                  <img
                    src={prod.imageLink}
                    className="absolute -z-10 top-0 left-0  object-cover w-full h-full"
                    alt=""
                  />
                  <div
                    style={{
                      background: `linear-gradient(180deg , transparent,transparent, #222)`,
                    }}
                    className="w-full h-full absolute  top-0 left-0"
                  ></div>
                  <p className="text-[10px] tracking-wider text-white text-center z-20">
                    {prod.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminCollectionDetails;
