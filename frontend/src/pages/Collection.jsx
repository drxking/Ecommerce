import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import Navbar from "../components/Navbar";

const Collection = () => {
  const [data, setData] = useState();
  const { id } = useParams();

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
  }, [id]);

  return (
    <>
      <Navbar />
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
    </>
  );
};

export default Collection;
