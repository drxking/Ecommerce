import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import AddCollection from "../components/AddCollection";
import EditCollection from "../components/EditCollection";
import axios from "axios";
import { MutatingDots } from "react-loader-spinner";
import { Link } from "react-router-dom";

const AdminCollection = () => {
  const [open, setOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AddCollection
        handleUpload={handleUpload}
        open={open}
        handleClose={handleClose}
      />
      <EditCollection
        open={editOpen}
        handleClose={() => {
          setEditOpen(false);
          setEditingCollection(null);
        }}
        collection={editingCollection}
        onSuccess={(updated) => {
          setData((prev) =>
            prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c))
          );
        }}
      />
      <AdminNav />
      <div className="hero flex items-center justify-between md:px-8 px-4 py-6 border-b border-neutral-800">
        <h2 className="font-[900] flex md:flex-row flex-col md:gap-3 md:text-2xl uppercase">
          <p className="font-[panchang] leading-[1] text-white">Your</p>{" "}
          <p className="font-[panchang] leading-[1] text-white">Collections</p>
        </h2>
        <button
          onClick={handleOpen}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition rounded-none shadow-lg"
          style={{ borderRadius: 0 }}
        >
          <i className="ri-add-line"></i> Add Collection
        </button>
      </div>
      <div
        className={
          "w-full py-8 px-4 md:px-8 gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }
      >
        {isLoading ? (
          <div className="flex min-h-96 items-center justify-center w-full col-span-full">
            <MutatingDots
              visible={true}
              height="100"
              width="100"
              color="#fff"
              secondaryColor="#888"
              radius="12.5"
              ariaLabel="mutating-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          data.map((e) => (
            <div
              key={e.name + e._id}
              className="relative group overflow-hidden rounded-none border border-neutral-800 hover:border-neutral-600 bg-neutral-900 transition-all duration-300"
              style={{ borderRadius: 0 }}
            >
              <Link
                className="relative block w-full h-full"
                to={`/admin/collections/${e._id}`}
              >
                <img
                  loading="lazy"
                  src={e.thumbnailImageLink}
                  className="w-full h-full min-h-[450px] object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                  alt={e.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                <p className="absolute shadow-2xl leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[panchang] text-2xl px-2 w-full text-center text-white">
                  {e.name}
                </p>
                {e.description && (
                  <p className="absolute bottom-4 left-0 right-0 px-4 text-center text-xs text-white/80 line-clamp-2 font-light">
                    {e.description}
                  </p>
                )}
              </Link>

              {/* Quick Edit Button */}
              <button
                type="button"
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  setEditingCollection(e);
                  setEditOpen(true);
                }}
                title="Edit Collection Details & Image"
                className="absolute top-3 right-3 z-10 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-none shadow-lg flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-neutral-200"
                style={{ borderRadius: 0 }}
              >
                <i className="ri-edit-line text-xs"></i>
                <span>Edit</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCollection;
