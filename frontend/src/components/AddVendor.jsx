import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

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
      className="fixed duration-200 opacity-0 pointer-events-none h-screen w-screen bg-black/80 backdrop-blur-md z-50 px-4 flex items-center justify-center"
    >
      <div
        onClick={handleClose}
        className="close -z-10 h-full w-full absolute cursor-pointer"
      ></div>
      <div
        className="post w-full max-w-lg bg-neutral-900 border border-neutral-800 p-6 md:p-8 text-white shadow-2xl rounded-none"
        style={{ borderRadius: 0 }}
      >
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
          <h2 className="font-bold text-lg md:text-xl uppercase tracking-wider font-[panchang]">
            Add Vendor
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <i className="ri-close-line text-2xl leading-none"></i>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-850 text-red-300 text-xs flex items-center gap-2">
            <i className="ri-error-warning-line text-sm text-red-400"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          <div className="name flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-t border-neutral-800 pt-3">
            <label
              htmlFor="name"
              className="text-xs uppercase tracking-wider w-full sm:w-[35%] font-semibold text-neutral-300"
            >
              Name <span className="text-red-400">*</span>
            </label>
            <input
              ref={name}
              required
              className="p-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 w-full focus:outline-none focus:border-white text-xs rounded-none transition"
              placeholder="e.g. Nike, Rick Owens"
              id="name"
              type="text"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="name flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-t border-neutral-800 pt-3">
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-wider w-full sm:w-[35%] font-semibold text-neutral-300"
            >
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              required={true}
              ref={email}
              className="p-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 w-full focus:outline-none focus:border-white text-xs rounded-none transition"
              placeholder="vendor@company.com"
              id="email"
              type="email"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="name flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 border-t border-neutral-800 pt-3">
            <label
              htmlFor="phone"
              className="text-xs uppercase tracking-wider w-full sm:w-[35%] font-semibold text-neutral-300 pt-1"
            >
              Phone <span className="text-red-400">*</span>
            </label>
            <div className="w-full">
              <input
                required={true}
                ref={phone}
                className="p-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 w-full focus:outline-none focus:border-white text-xs rounded-none transition"
                placeholder="+1 555-0199 or +977..."
                id="phone"
                type="text"
                style={{ borderRadius: 0 }}
              />
              <p className="text-neutral-500 text-[10px] mt-1">
                *Include international dialing code
              </p>
            </div>
          </div>

          <div className="name flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-t border-neutral-800 pt-3">
            <label
              htmlFor="address"
              className="text-xs uppercase tracking-wider w-full sm:w-[35%] font-semibold text-neutral-300"
            >
              Address <span className="text-red-400">*</span>
            </label>
            <input
              required={true}
              ref={address}
              className="p-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 w-full focus:outline-none focus:border-white text-xs rounded-none transition"
              placeholder="e.g. Los Angeles, CA"
              id="address"
              type="text"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="name flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-3 border-t border-neutral-800">
            <label
              htmlFor="image"
              className="text-xs uppercase tracking-wider w-full sm:w-[35%] font-semibold text-neutral-300"
            >
              Photo <span className="text-red-400">*</span>
            </label>

            <div className="w-full relative flex items-center gap-3">
              <input
                className="hidden"
                id="image"
                type="file"
                ref={image}
                required={true}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/jpg, image/webp"
              />
              <div
                onClick={handleImageClick}
                className="h-16 w-16 cursor-pointer border border-dashed border-neutral-700 hover:border-white bg-neutral-950 flex flex-col items-center justify-center text-neutral-400 hover:text-white transition rounded-none"
                style={{ borderRadius: 0 }}
                title="Select vendor logo"
              >
                <i className="ri-image-add-line text-2xl"></i>
              </div>
              <img
                ref={preview}
                alt=""
                className="w-20 h-16 object-cover border border-neutral-800 bg-neutral-950 opacity-0 transition-opacity rounded-none"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-800 gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-neutral-700 text-neutral-300 text-xs font-semibold hover:bg-neutral-800 transition uppercase tracking-wider rounded-none"
              style={{ borderRadius: 0 }}
            >
              Cancel
            </button>
            <button
              id="submit"
              type="submit"
              disabled={submitted}
              className="px-6 py-2.5 relative text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition cursor-pointer disabled:opacity-50 rounded-none shadow"
              style={{ borderRadius: 0 }}
            >
              Add Vendor
              {submitted && (
                <div className="h-full w-full absolute bg-black top-0 left-0 flex items-center justify-center">
                  <div className="loader h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
