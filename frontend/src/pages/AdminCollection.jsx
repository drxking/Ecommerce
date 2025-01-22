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
  function handleUpload() {
    setrenderer((e) => !e);
    console.log(renderer);
  }

  async function fetchCollection() {
    let response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/collections/admincollection`,
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
      <div className="hero flex items-center justify-between md:px-10 px-4 py-4 ">
        <h2 className="font-semibold flex md:flex-row flex-col md:gap-3 md:text-2xl font-[panchang]  uppercase pl-3">
          <p className="font-[panchang] leading-[1]">Your</p> <p className="font-[panchang] leading-[1]">Collections</p>
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
          data.length > 3
            ? "w-full md:px-10 px-4 py-4 flex flex-wrap justify-center gap-3"
            : " w-full md:px-10 px-4 py-4 flex flex-wrap md:justify-start justify-center gap-3"
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
            to={`/admin/collections/${e._id}`}
              key={e.name}
              className="md:w-72 p-4 w-full  bg-gray-200 rounded-3xl "
            >
              <h2 className="text-xl font-semibold font-[panchang]">
                {e.name}
              </h2>
              <ul className="flex mt-2 flex-row gap-1 text-sm  font-medium leading-none">
                <div className="pt-1 w-[25%] font-medium text-gray-500">
                  Type :
                </div>
                <div className="flex flex-wrap font-thin tracking-wide gap-1 w-[75%]">
                  {e.type.map((i) => (
                    <li
                      key={i.name}
                      className="capitalize px-3 p-1 bg-gray-700 text-xs text-white rounded-full"
                    >
                      {i.name}
                    </li>
                  ))}
                </div>
              </ul>
              <ul className="flex gap-1 pt-1 text-sm  leading-none">
                <div className="pt-1 w-[25%] font-medium text-gray-500">
                  Products:
                </div>
                <div className="flex flex-wrap gap-1 w-[75%]">
                  {e.products.map((i) => (
                    <li
                      key={i.name}
                      className=" max-w-full p-1 flex font-thin tracking-wide gap-1 items-center bg-gray-700 text-xs text-white rounded-full"
                    >
                      <img
                        src={i.imageLink}
                        className="h-5 w-5 min-w-5 rounded-full object-cover"
                      />
                      <p className="capitalize truncate">
                      {i.name}
                      </p>
                    </li>
                  ))}
                </div>
              </ul>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCollection;
