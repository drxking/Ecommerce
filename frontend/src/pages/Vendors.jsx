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
    <>
      <AddVendor
        handleClose={handleClose}
        handleUpload={handleUpload}
        open={open}
      />
      <AdminNav />
      <h2 className="font-semibold text-xl md:text-2xl font-[panchang]  uppercase pl-3 md:px-10 py-4">
        Your Vendors
      </h2>
      <div className="w-full overflow-scroll no-scroller">
        <table className="flex  flex-col w-full px-2 md:px-10 pb-10 min-w-[1000px]">
          <thead className=" text-xs   py-0">
            <tr className="flex text-[#9fa0a0]">
              <th className="w-[10%]  border-b  font-medium py-2 text-start flex pl-4 rounded-tl-3xl  bg-gray-200/50 items-center">
                Image
              </th>
              <th className="w-[15%]  border-b  font-medium py-2 text-start flex  bg-gray-200/50 items-center">
                Vendor Name
              </th>
              <th className="w-[18%]   border-b font-medium py-2 text-start flex  bg-gray-200/50 items-center">
                Email
              </th>
              <th className="w-[18%]  border-b font-medium py-2 text-start flex  bg-gray-200/50 items-center">
                Phone
              </th>
              <th className="w-[18%]  border-b font-medium py-2 text-start flex  bg-gray-200/50 items-center">
                Address
              </th>
              <th className="w-[5%]  border-b font-medium py-2 text-start flex items-center bg-gray-200/50 rounded-tr-3xl ">
                Edit
              </th>
              <th className="w-[16%] relative font-medium py-2 px-2 text-start flex items-center  bg-gray-200/50 justify-center">
                <div className="h-full w-full absolute bg-white rounded-bl-3xl"></div>
                <button
                  onClick={handleOpen}
                  className="z-20  text-white relative font-semibold overflow-hidden flex-1 py-2 rounded-full "
                >
                  <img
                    src="/mask2.webp"
                    className="w-full h-full brightness-[85%]  -z-10 absolute top-0 left-0"
                  />
                  Add Vendor
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="w-full  rounded-tr-3xl rounded-b-3xl bg-gray-200/50  ">
            {data?.map((items, index) => (
              <React.Fragment key={items.name}>
                <tr
                  key={items.name}
                  className={
                    index == data.length - 1
                      ? "text-xs inline-block align-middle pb-4  px-2 py-1 w-full"
                      : "  text-xs inline-block align-middle   px-2 py-1 w-full"
                  }
                >
                  <td className="inline-block w-[10%] pl-3  font-medium text-start">
                    <img
                      src={items.imageLink}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </td>
                  <td className="inline-block w-[15%] truncate  font-medium text-start">
                    {items.name}
                  </td>
                  <td className="inline-block w-[18%] max-w-[18%] truncate  overflow-scroll no-scroller font-medium text-start">
                    {items.contactEmail}
                  </td>
                  <td className="inline-block w-[18%] truncate  font-medium text-start">
                    {items.contactPhone}
                  </td>
                  <td className="inline-block w-[18%] truncate  font-medium text-start">
                    {items.address}
                  </td>
                  <td className="inline-block w-[8%]  font-medium text-start">
                    <i
                      onClick={() => handleDropOpen(index)}
                      className={`ri-quill-pen-line  p-2 text-xs cursor-pointer rounded-full bg-black text-white`}
                    ></i>
                  </td>
                  <td className="inline-block w-[10%] bg-gray-300  font-medium text-start"></td>
                </tr>

                <tr
                  id={`drop-${index}`}
                  className={
                    index === data.length - 1
                      ? `text-xs   hidden  py-4 pt-1 overflow-hidden w-full align-bottom `
                      : `text-xs   hidden  py-4  overflow-hidden w-full align-bottom border-b border-gray-200 `
                  }
                >
                  <td className="inline-block w-[10%] pl-6   font-medium text-start">
                    <p className="font-semibold pb-3 font-[panchang]">Edit </p>
                  </td>
                  <td className="inline-block w-[15%]  font-medium text-start">
                    <div className="name  gap-6   pr-4">
                      <label
                        htmlFor={`name-${index}`}
                        className="text-xs w-[40%] font-semibold text-gray-800"
                      >
                        Name
                      </label>
                      <input
                        id={`name-${index}`}
                        className="p-2 px-2 bg-white  w-full focus:outline-none rounded-lg text-xs"
                        placeholder="Nike"
                        type="text"
                        defaultValue={items.name}
                      />
                    </div>
                  </td>
                  <td className="inline-block w-[18%] max-w-[18%] overflow-scroll no-scroller font-medium text-start">
                    <div className="name  gap-6   pr-4">
                      <label
                        htmlFor={`email-${index}`}
                        className="text-xs w-[40%] font-semibold text-gray-800"
                      >
                        Email
                      </label>
                      <input
                        className="p-2 px-2 bg-white   w-full focus:outline-none rounded-lg text-xs"
                        placeholder="nike@gmail.com"
                        id={`email-${index}`}
                        type="email"
                        defaultValue={items.contactEmail}
                      />
                    </div>
                  </td>
                  <td className="inline-block w-[18%]  font-medium text-start">
                    <div className="name  gap-6   pr-4">
                      <label
                        htmlFor={`phone-${index}`}
                        className="text-xs w-[40%] font-semibold text-gray-800"
                      >
                        Phone
                      </label>
                      <input
                        className="p-2 px-2 bg-white   w-full focus:outline-none rounded-lg text-xs"
                        placeholder="+97 9876443210"
                        id={`phone-${index}`}
                        type="text"
                        defaultValue={items.contactPhone}
                      />
                    </div>
                  </td>
                  <td className="inline-block w-[18%]  font-medium text-start">
                    <div className="name  gap-6   pr-4">
                      <label
                        htmlFor={`address-${index}`}
                        className="text-xs w-[40%] font-semibold text-gray-800"
                      >
                        Address
                      </label>
                      <input
                        className="p-2 px-2 bg-white  w-full focus:outline-none rounded-lg text-xs"
                        placeholder="California"
                        id={`address-${index}`}
                        type="text"
                        defaultValue={items.address}
                      />
                    </div>
                  </td>
                  <td className="inline-block w-[18%] font-medium text-start">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => {
                          const name = document.getElementById(
                            `name-${index}`
                          ).value;
                          const email = document.getElementById(
                            `email-${index}`
                          ).value;
                          const phone = document.getElementById(
                            `phone-${index}`
                          ).value;
                          const address = document.getElementById(
                            `address-${index}`
                          ).value;

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
                        className="px-4 py-2 relative overflow-hidden bg-black text-xs rounded-md text-white"
                      >
                        Update
                        {/* {updateSubmitted ? (
                          <div className="h-full w-full top-0 left-0 absolute z-20 bg-black flex items-center justify-center">
                            <div className="loader animate-spin border-x-2 border-x-white border-y-2 border-y-transparent h-5 w-5 rounded-full"></div>
                          </div>
                        ) : (
                          ""
                        )} */}
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteCancel(index);
                          handleDropClose(index);
                        }}
                      >
                        <i className="ri-close-line text-base h-7 w-7  flex items-center justify-center  rounded-full border font-semibold border-black"></i>
                      </button>

                      <div className="relative  h-7 w-7 overflow-hidden rounded-full">
                        <i
                          id={`warn-${index}`}
                          onClick={(e) => (e.target.style.display = "none")}
                          className="ri-delete-bin-line text-base cursor-pointer absolute flex items-center justify-center  h-full w-full z-20  rounded-full text-white   bg-red-500"
                        ></i>
                        {deleteSubmitted ? (
                          <div className="h-full w-full animate-spin z-20 flex items-center justify-center absolute">
                            <div className="loader border-x-2 border-x-black border-y-2 border-y-transparent h-5 w-5 rounded-full"></div>
                          </div>
                        ) : (
                          <i
                            onClick={() => handleDelete(items._id)}
                            className="ri-check-line text-base w-full h-full cursor-pointer text-black border border-black rounded-full absolute left-0 top-0 flex items-center justify-center"
                          ></i>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Vendors;
