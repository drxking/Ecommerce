import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import ErrorLogger from "./errorLogger";

const AddVendor = ({ open, handleClose, handleUpload }) => {
  let [file, setfile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  let name = useRef();
  let image = useRef();
  let email = useRef();
  let phone = useRef();
  let address = useRef();
  let preview = useRef();
  let popup = useRef();

  useEffect(() => {
    if (open) {
      popup.current.style.opacity = 1;
      popup.current.style.pointerEvents = "unset";
    } else {
      popup.current.style.opacity = 0;
      popup.current.style.pointerEvents = "none";
      clearForm();
    }
  });
  function clearForm() {
    name.current.value = "";
    email.current.value = "";
    phone.current.value = "";
    address.current.value = "";
    setfile(null);
    preview.current.src = "";
    preview.current.style.opacity = 0;
  }

  function handleImageClick() {
    image.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];
    setfile(event.target.files[0]);
    if (file) {
      const reader = new FileReader();

      // When the file is loaded, update the img src and make it visible
      reader.onload = function (e) {
        preview.current.src = e.target.result;
        preview.current.style.opacity = 1;
      };

      reader.readAsDataURL(file);
    }
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);

    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/vendors/addvendor`,
        {
          name: name.current.value,
          email: email.current.value,
          phone: phone.current.value,
          address: address.current.value,
          image: file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.status == "success") {
        handleUpload(response.data.data);
        handleClose();
        clearForm();
        setSubmitted(false);
      } else {
        setSubmitted(false);
      }
    } catch (err) {
      console.log(err);
      setSubmitted(false);
      setError(err.response.data.message);
    }
  }

  

  return (
    <div
      ref={popup}
      className="fixed duration-200 opacity-0 pointer-events-none h-screen w-screen backdrop-brightness-50 z-40 px-2 flex items-center justify-center"
    >
      <ErrorLogger err={error} />
      <div
        onClick={handleClose}
        className="close  -z-10  h-full w-full absolute"
      ></div>
      <div className="post w-[450px] rounded-3xl bg-white p-8  text-black">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl">Add Vendor</h2>
          <div className="button cursor-pointer">
            <i
              onClick={handleClose}
              className="ri-close-line text-2xl leading-none"
            ></i>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="pt-5">
          <div className="name flex gap-6 pt-3 border-t border-gray-200 py-2">
            <label
              htmlFor="name"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Name
            </label>
            <input
              ref={name}
              className="p-2 px-2 border border-gray-300 w-full focus:outline-none rounded-lg text-sm"
              placeholder="Nike"
              id="name"
              type="text"
            />
          </div>

          <div className="name flex  gap-6 pt-3 border-t border-gray-200 py-2">
            <label
              htmlFor="email"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Email Address
            </label>
            <input
              required={true}
              ref={email}
              className="p-2 px-2 border border-gray-300 w-full focus:outline-none rounded-lg text-sm"
              placeholder="example@gmail.com"
              id="email"
              type="email"
            />
          </div>
          <div className="name flex  gap-6 pt-3 border-t border-gray-200 py-2">
            <label
              htmlFor="phone"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Phone
            </label>
            <div className="w-full">
              <input
                required={true}
                ref={phone}
                className="p-2 px-2 border border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                placeholder="+977 9876543210"
                id="phone"
                type="text"
              />
              <p className="text-gray-600 text-xs p-1">
                *Must Include Country Code i.e +977
              </p>
            </div>
          </div>
          <div className="name flex gap-6 pt-3 border-t border-gray-200 py-2">
            <label
              htmlFor="address"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Address
            </label>
            <input
              required={true}
              ref={address}
              className="p-2 px-2 border border-gray-300 w-full focus:outline-none rounded-lg text-sm"
              placeholder="Los Angeles"
              id="address"
              type="text"
            />
          </div>
          <div className="name flex gap-6 pt-3 border-t border-gray-200 py-2">
            <label
              htmlFor="image"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Photo
            </label>

            <div className="w-full px-5">
              <input
                className="p-2 px-2 border h-16 w-16 opacity-0 absolute border-gray-300  focus:outline-none rounded-lg text-sm"
                placeholder="Los Angeles"
                id="image"
                type="file"
                ref={image}
                required={true}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/jpg"
              />
              <div
                onClick={handleImageClick}
                className="h-16 relative w-16 overflow-hidden rounded-full cursor-pointer border border-gray-300 flex items-center justify-center"
              >
                <i className="ri-image-add-line text-2xl"></i>
                <img
                  ref={preview}
                  className="h-full w-full object-cover absolute z-10 opacity-0"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              id="submit"
              type="submit"
              className="px-4 py-2 relative rounded-md overflow-hidden text-sm font-semibold bg-black text-white cursor-pointer"
            >
              Add Vendor
              {submitted ? (
                <div className="h-full w-full absolute bg-black top-0 left-0 flex items-center justify-center ">
                  <div className="loader h-5 w-5 border-x-2 border-x-white border-y-transparent border-y-2 rounded-full animate-spin"></div>
                </div>
              ) : (
                ""
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
