import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const AddCollection = ({ open, handleClose, handleUpload }) => {
  let [file, setfile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [fetchedTypes, setfetchedTypes] = useState([]);
  const [selectedTypes, setselectedTypes] = useState([]);

  let name = useRef();
  let image = useRef();
  let type = useRef();
  let products = useRef();

  const popup = useRef(null);
  const preview = useRef(null);

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
    type.current.value = "";
    products.current.value = "";
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
    }
  }

  let timeout;
  async function handleType() {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      let text = type.current.value;
      if (text.trim() === "") return setfetchedTypes([]);
      let response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/types/search?type=${text}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status == "success") {
        setfetchedTypes(response.data.data);
      } else {
        setfetchedTypes([]);
      }
    }, 700);
  }

  function handleTypeClick(i) {
    setselectedTypes((e) => [...e, i]);
  }
  function handleTypeClickRemove(e) {
    if (selectedTypes.length > 1) {
      selectedTypes.forEach((i, index) => {
        if (i._id == e._id) {
          const removed = selectedTypes.splice(index, 1);
          setselectedTypes(removed);
        }
      });
    } else {
      setselectedTypes([]);
    }
  }
  useEffect(() => {
  }, [selectedTypes]);
  return (
    <div
      ref={popup}
      className="fixed duration-200 opacity-0 pointer-events-none h-screen w-screen backdrop-brightness-50 z-40 px-2 flex items-center justify-center"
    >
      <div
        onClick={handleClose}
        className="close  -z-10  h-full w-full absolute"
      ></div>
      <div className="post w-[450px] rounded-3xl bg-white p-8  text-black">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl">Add Collection</h2>
          <div className="button cursor-pointer">
            <i
              onClick={handleClose}
              className="ri-close-line text-2xl leading-none"
            ></i>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="pt-5">
          <div className="name flex border-t gap-6 pt-3  border-gray-200 py-2">
            <label
              htmlFor="name"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Name
            </label>
            <input
              ref={name}
              className="p-2 border  border-gray-300 w-full focus:outline-none rounded-lg text-sm"
              placeholder="Mens Collection"
              id="name"
              type="text"
            />
          </div>

          <div className=" flex border-t  gap-6 pt-3  border-gray-200 py-2">
            <label
              htmlFor="type"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Type
            </label>
            <div className="w-full relative">
              {selectedTypes.length != 0 ? (
                <div className="flex items-center py-1">
                  {selectedTypes.map((tp) => (
                    <span className="text-sm bg-black rounded-full relative p-1  px-3 pr-7 mr-1 inline-block text-white">
                      {tp.name}
                      <i
                        onClick={() => handleTypeClickRemove(tp)}
                        class="ri-close-line top-1/2 -translate-y-1/2 cursor-pointer absolute right-1 mr-1 bg-white h-4 flex items-center justify-center  w-4 rounded-full text-sm text-black"
                      ></i>
                    </span>
                  ))}
                </div>
              ) : (
                ""
              )}
              <input
                onChange={handleType}
                ref={type}
                className="p-2 border border-gray-300 w-full  focus:outline-none rounded-lg text-sm"
                placeholder="Search 'T-shirt' "
                id="type"
                type="text"
              />
              {fetchedTypes.length != 0 ? (
                <div
                  id="dropdown-type"
                  style={{ boxShadow: "0 0 2px #222" }}
                  className=" w-full absolute flex flex-col  bg-white rounded-lg"
                >
                  {fetchedTypes.map((ty, index) =>
                    selectedTypes.some((item) => item._id === ty._id) ? (
                      <p key={index} className="hidden">
                        {ty.name}
                      </p>
                    ) : (
                      <p
                        key={index}
                        onClick={() => {
                          handleTypeClick(ty);
                        }}
                        className={
                          index == 0
                            ? "p-2 text-sm border-gray-300 hover:bg-blue-100/50 cursor-pointer capitalize"
                            : "p-2 text-sm border-t border-gray-300 hover:bg-blue-100/50 cursor-pointer capitalize"
                        }
                      >
                        {ty.name}
                      </p>
                    )
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="border-t flex gap-6 pt-3  border-gray-200 py-2">
            <label
              htmlFor="products"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Products
            </label>
            <input
              ref={products}
              className="p-2 border border-gray-300 w-full focus:outline-none rounded-lg text-sm"
              placeholder="Search 'Hoodie'"
              id="products"
              type="text"
            />
          </div>
          <div className="border-t flex gap-6 pt-3  border-gray-200 py-2">
            <label
              htmlFor="image"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Photo
            </label>

            <div className="w-full px-5">
              <input
                className="p-2 border h-16 w-16 opacity-0 absolute border-gray-300  focus:outline-none rounded-lg text-sm"
                placeholder="Los Angeles"
                id="image"
                type="file"
                ref={image}
                required={true}
                onChange={handleImageChange}
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
              Add Collection
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

export default AddCollection;
