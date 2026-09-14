import React, { useEffect, useRef, useState } from "react";
import AdminNav from "../components/AdminNav";
import AddVendor from "../components/AddVendor";
import axios from "axios";
import gsap from "gsap";

const Vendors = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [rerender, setrerender] = useState(false);
  const [deleteSubmitted, setdeleteSubmitted] = useState(false);
  const [updateSubmitted, setUpdateSubmitted] = useState(false);

  function handleDropOpen(e) {
    gsap.to(`#drop-${e}`, {
      display: "inline-block",
      duration: 0,
    });
  }
  function handleDropClose(e) {
    gsap.to(`#drop-${e}`, {
      display: "none",
      duration: 0,
    });
  }

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  function handleUpload(e) {
    setData((y) => [...y, e]);
  }

  async function handleDelete(id) {
    setdeleteSubmitted(true);
    let response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/vendors/${id}`,
      {
        withCredentials: true,
      }
    );
    if (response.data.status == "success") {
      setrerender((e) => !e);
      setdeleteSubmitted(false);
    } else {
      console.log("Cannot fecth data");
      setdeleteSubmitted(false);
    }
  }
  function handleDeleteCancel(e) {
    document.getElementById(`warn-${e}`).style.display = "flex";
  }

  async function handleSubmit(...args) {
    if (
      args[1] !== args[5] ||
      args[2] !== args[6] ||
      args[3] !== args[7] ||
      args[4] !== args[8]
    ) {
      setUpdateSubmitted(true);

      let response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/vendors/${args[0]}`,
        {
          name: args[1],
          email: args[2],
          phone: args[3],
          address: args[4],
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.status == "success") {
        setrerender((e) => !e);
        handleDropClose(args[9]);
        setUpdateSubmitted(false);
      } else {
        console.log("Cannot fecth data");
        setUpdateSubmitted(false);
      }
    }
  }

  let fetchData = async () => {
    let response = await axios.get(`${import.meta.env.VITE_BASE_URL}/vendors`, {
      withCredentials: true,
    });
    if (response.data.status == "success") {
      setData(response.data.data);
    } else {
      console.log("Cannot fecth data");
    }
  };
  useEffect(() => {
    fetchData();
  }, [rerender]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <AddVendor
        handleClose={handleClose}
        handleUpload={handleUpload}
        open={open}
      />
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-5 mb-6 gap-4">
          <div>
            <h2 className="font-bold text-xl md:text-2xl font-[panchang] uppercase tracking-wider text-white">
              Vendor Directory
            </h2>
            <p className="text-neutral-400 text-xs mt-1">
              Manage authorized suppliers, partner brands, and manufacturing contacts
            </p>
          </div>
          <button
            onClick={handleOpen}
            className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none shadow transition"
            style={{ borderRadius: 0 }}
          >
            <i className="ri-user-add-line text-sm"></i> Add Vendor
          </button>
        </div>

        <div className="w-full overflow-x-auto border border-neutral-800 bg-neutral-900/90 rounded-none shadow-xl" style={{ borderRadius: 0 }}>
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-neutral-950 text-[10px] uppercase text-neutral-400 font-semibold border-b border-neutral-800 tracking-wider">
                <th className="p-3.5 w-16">Avatar</th>
                <th className="p-3.5">Vendor Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Address</th>
                <th className="p-3.5 text-center w-20">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-xs">
              {data?.map((items, index) => (
                <React.Fragment key={items._id || items.name || index}>
                  <tr className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="h-9 w-9 rounded-none overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center" style={{ borderRadius: 0 }}>
                        {items.imageLink ? (
                          <img
                            src={items.imageLink}
                            alt={items.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <i className="ri-user-line text-neutral-500"></i>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-white">
                      {items.name}
                    </td>
                    <td className="p-3.5 text-neutral-300 font-mono text-[11px]">
                      {items.contactEmail}
                    </td>
                    <td className="p-3.5 text-neutral-300 font-mono text-[11px]">
                      {items.contactPhone}
                    </td>
                    <td className="p-3.5 text-neutral-400">
                      {items.address}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDropOpen(index)}
                        className="p-1.5 bg-neutral-800 hover:bg-white hover:text-black text-neutral-300 border border-neutral-700 rounded-none transition"
                        style={{ borderRadius: 0 }}
                        title="Edit vendor"
                      >
                        <i className="ri-edit-line text-sm"></i>
                      </button>
                    </td>
                  </tr>

                  <tr
                    id={`drop-${index}`}
                    style={{ display: "none" }}
                    className="bg-neutral-950 border-y border-neutral-800 text-xs"
                  >
                    <td colSpan={6} className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                          <p className="font-bold font-[panchang] uppercase tracking-wider text-xs text-white">
                            Edit Vendor: {items.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleDropClose(index)}
                            className="text-neutral-400 hover:text-white text-sm"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                              Name
                            </label>
                            <input
                              id={`name-${index}`}
                              className="p-2 bg-neutral-900 border border-neutral-800 w-full text-white text-xs focus:outline-none focus:border-white rounded-none"
                              style={{ borderRadius: 0 }}
                              defaultValue={items.name}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                              Email
                            </label>
                            <input
                              id={`email-${index}`}
                              className="p-2 bg-neutral-900 border border-neutral-800 w-full text-white text-xs focus:outline-none focus:border-white rounded-none"
                              style={{ borderRadius: 0 }}
                              defaultValue={items.contactEmail}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                              Phone
                            </label>
                            <input
                              id={`phone-${index}`}
                              className="p-2 bg-neutral-900 border border-neutral-800 w-full text-white text-xs focus:outline-none focus:border-white rounded-none"
                              style={{ borderRadius: 0 }}
                              defaultValue={items.contactPhone}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                              Address
                            </label>
                            <input
                              id={`address-${index}`}
                              className="p-2 bg-neutral-900 border border-neutral-800 w-full text-white text-xs focus:outline-none focus:border-white rounded-none"
                              style={{ borderRadius: 0 }}
                              defaultValue={items.address}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              const name = document.getElementById(`name-${index}`).value;
                              const email = document.getElementById(`email-${index}`).value;
                              const phone = document.getElementById(`phone-${index}`).value;
                              const address = document.getElementById(`address-${index}`).value;

                              handleSubmit(
                                items._id,
                                name,
                                email,
                                phone,
                                address,
                                items.name,
                                items.contactEmail,
                                items.contactPhone,
                                items.address,
                                index
                              );
                            }}
                            className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded-none transition"
                            style={{ borderRadius: 0 }}
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(items._id)}
                            className="px-3 py-2 bg-red-950/60 border border-red-850 hover:bg-red-900/60 text-red-300 text-xs font-semibold uppercase tracking-wider rounded-none transition"
                            style={{ borderRadius: 0 }}
                            title="Delete Vendor"
                          >
                            <i className="ri-delete-bin-line mr-1"></i> Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Vendors;
