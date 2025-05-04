import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import Navbar from "../components/Navbar";

const Collection = () => {
  const [data, setData] = useState();
  const { id } = useParams();
  const [loading, setLoading] = useState(true)

  async function fetchOneCollectionn() {
    let response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/collections/${id}`,
      {
        withCredentials: true,
      }
    );
    if (response.data.status == "success") {
      setData(response.data.data);
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOneCollectionn();
  }, [id]);

  return (
    <>
      <Navbar />

      {
        loading ? (
          <div className="md:px-20 px-5 p-5 pt-10">


            <div className="bg-gray-300 h-10 w-80"></div>
            <div className="flex gap-2 flex-wrap mt-2">
              <div className="bg-gray-300 h-7 w-24"></div>
              <div className="bg-gray-300 h-7 w-14"></div>
              <div className="bg-gray-300 h-7 w-20"></div>

            </div>
            <main className=" flex gap-6 flex-wrap mt-10">
              <div className="sm:w-60 w-full flex flex-col gap-2">
                <div className=" sm:h-72 h-96 bg-gray-300"></div>
                <div className="bg-gray-300 h-7 w-3/4"></div>
                <div className="bg-gray-300 h-4 w-2/4"></div>
                <div className="bg-gray-300 h-5 w-1/4"></div>
              </div>
              <div className="sm:w-60 w-full flex flex-col gap-2">
                <div className=" sm:h-72 h-96 bg-gray-300"></div>
                <div className="bg-gray-300 h-7 w-3/4"></div>
                <div className="bg-gray-300 h-4 w-2/4"></div>
                <div className="bg-gray-300 h-5 w-1/4"></div>
              </div>
              <div className="sm:w-60 w-full flex flex-col gap-2">
                <div className=" sm:h-72 h-96 bg-gray-300"></div>
                <div className="bg-gray-300 h-7 w-3/4"></div>
                <div className="bg-gray-300 h-4 w-2/4"></div>
                <div className="bg-gray-300 h-5 w-1/4"></div>
              </div>
              <div className="sm:w-60 w-full flex flex-col gap-2">
                <div className=" sm:h-72 h-96 bg-gray-300"></div>
                <div className="bg-gray-300 h-7 w-3/4"></div>
                <div className="bg-gray-300 h-4 w-2/4"></div>
                <div className="bg-gray-300 h-5 w-1/4"></div>
              </div>

            </main>
          </div>
        ) : (
          <main className="md:px-20 px-5 p-5 pt-10">
            <h1 className="font-[panchang] font-semibold md:font-semibold md:text-3xl text-3xl leading-none">
              {data?.name}
            </h1>
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
              {data?.products.map((e) => (
                <Card key={e.name} {...e} />
              ))}
            </div>
          </main>
        )
      }

    </>
  );
};

export default Collection;
