import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import AddCollection from "../components/AddCollection";
import axios from "axios";
import { MutatingDots } from "react-loader-spinner";
import { Link } from "react-router-dom";

const AdminCollection = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [renderer, setrenderer] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  function handleUpload(e) {
    setData((i) => [...i, e]);
  }

  async function fetchCollection() {
    let response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/collections/pure`,
      {
        withCredentials: true,
      }
    );
    if (response.data.status == "success") {
      setData(response.data.data);
      setisLoading(false);
    }
  }

  useEffect(() => {
    fetchCollection();
  }, []);

  return (
    <div>
      <AddCollection
        handleUpload={handleUpload}
        open={open}
        handleClose={handleClose}
      />
      <AdminNav />
      <div className="hero flex items-center justify-between md:px-5 px-4 py-4 ">
        <h2 className="font-[900] flex md:flex-row flex-col md:gap-3 md:text-2xl  uppercase">
          <p className="font-[panchang] leading-[1]">Your</p>{" "}
          <p className="font-[panchang] leading-[1]">Collections</p>
        </h2>
        <button
          onClick={handleOpen}
          className="z-20 text-white md:text-base text-sm relative font-semibold overflow-hidden px-3 py-2  leading-none rounded-full "
        >
          <img
            src="/mask2.webp"
            className="w-full h-full brightness-[85%] object-cover -z-10 absolute top-0 left-0"
          />
          Add Collection
        </button>
      </div>
      <div
        className={
          "w-full  py-4 flex-1  justify-start px-5 md:px-5 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  p-4"
        }
      >
        {isLoading ? (
          <div className="flex min-h-96 items-center justify-center w-full">
            <MutatingDots
              visible={true}
              height="100"
              width="100"
              color="#000"
              secondaryColor="#000"
              radius="12.5"
              ariaLabel="mutating-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          data.map((e) => (
            <Link
              key={e.name + e._id} 
              className="relative  inline-block"
              to={`/admin/collections/${e._id}`}
            >
              <img
                loading="lazy"
                src={e.thumbnailImageLink}
                className="w-full  h-full max-h-[450px] object-cover"
                alt=""
              />
              <p className="absolute shadow-2xl leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[panchang] text-2xl px-2 w-full text-center text-white">
                {e.name}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCollection;
