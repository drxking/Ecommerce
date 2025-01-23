import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const AddCollection = ({ open, handleClose, handleUpload }) => {
  const [submitted, setSubmitted] = useState(false);
  const [fetchedTypes, setfetchedTypes] = useState([]);
  const [selectedTypes, setselectedTypes] = useState([]);

  const [fetchedProducts, setfetchedProducts] = useState([]);
  const [selectedProducts, setselectedProducts] = useState([]);
  const [thumbnails, setthumbnails] = useState();
  const [banners, setbanners] = useState();

  let name = useRef();
  let type = useRef();
  let products = useRef();
  let dropdown_type = useRef();
  let thumbnail = useRef();
  let preview = useRef();
  let banner = useRef();
  let preview2 = useRef();
  let dropdown_product = useRef();

  const popup = useRef(null);

  useEffect(() => {
    if (open) {
      popup.current.style.opacity = 1;
      popup.current.style.pointerEvents = "unset";

      console.log(selectedProducts, selectedTypes);
    } else {
      popup.current.style.opacity = 0;
      popup.current.style.pointerEvents = "none";
      clearForm();
    }
  }, [open]);

  function clearForm() {
    name.current.value = "";
    type.current.value = "";
    products.current.value = "";
    setselectedProducts([]);
    setselectedTypes([]);
    setfetchedProducts([]);
    setfetchedTypes([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);

    const formData = new FormData();
    for (let file of thumbnails) {
      formData.append("thumbnail", file);
    }
    for (let file of banners) {
      formData.append("banner", file);
    }
    formData.append("name", name.current.value);

    let shouldSendType = selectedTypes.map((e) => {
      return e._id;
    });
    let shouldSendProduct = selectedProducts.map((e) => {
      return e._id;
    });

    shouldSendType.forEach((i)=>{
      formData.append("type[]", i);
    })
    shouldSendProduct.forEach((i)=>{
      formData.append("products[]", i);
    })
    
    
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/collections`,
        formData,
        {
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
      setSubmitted(false);
      if (err.response.status == 400) {
        name.current.style.borderColor = "red";
        type.current.style.borderColor = "red";
        products.current.style.borderColor = "red";
        setTimeout(() => {
          name.current.style.borderColor = "#D1D5DB";
          type.current.style.borderColor = "#D1D5DB";
          products.current.style.borderColor = "#D1D5DB";
        }, 1000);
      }
    }
  }

  let timeout;
  async function handleType() {
    clearTimeout(timeout);
    let text = type.current.value;
    if (text.trim() === "") return setfetchedTypes([]);
    timeout = setTimeout(async () => {
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
    }, 400);
  }

  function handleTypeClick(i) {
    setselectedTypes((e) => [i, ...e]);
    dropdown_type.current.style.display = "none";
  }

  function handleTypeClickRemove(e) {
    if (selectedTypes.length > 1) {
      selectedTypes.forEach((i, index) => {
        if (i._id == e._id) {
          const newArray = selectedTypes.filter((_, i) => i !== index);
          setselectedTypes(newArray);
        }
      });
    } else {
      setselectedTypes([]);
    }
  }

  let timeout1;
  async function handleProduct() {
    clearTimeout(timeout1);
    let text = products.current.value;
    if (text.trim() === "") return setfetchedProducts([]);
    timeout1 = setTimeout(async () => {
      let response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products/search?product=${text}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status == "success") {
        setfetchedProducts(response.data.data);
        console.log(response.data.data);
      } else {
        setfetchedProducts([]);
      }
    }, 400);
  }

  function handleProductClick(i) {
    setselectedProducts((e) => [i, ...e]);
    dropdown_product.current.style.display = "none";
  }

  function handleProductClickRemove(e) {
    if (selectedProducts.length > 1) {
      selectedProducts.forEach((i, index) => {
        if (i._id == e._id) {
          const newArray = selectedProducts.filter((_, i) => i !== index);
          setselectedProducts(newArray);
        }
      });
    } else {
      setselectedProducts([]);
    }
  }

  function handleThumbnailChange(event) {
    const file = event.target.files[0];
    setthumbnails(event.target.files);
    console.log(file);
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.current.src = e.target.result;
        preview.current.style.opacity = 1;
      };

      reader.readAsDataURL(file);
    }
  }
  function handleThumbnailClick() {
    thumbnail.current.click();
  }

  function handleBannerChange() {
    const file = event.target.files[0];
    setbanners(event.target.files);
    if (file) {
      const reader = new FileReader();

      // When the file is loaded, update the img src and make it visible
      reader.onload = function (e) {
        preview2.current.src = e.target.result;
        preview2.current.style.opacity = 1;
      };

      reader.readAsDataURL(file);
    }
  }
  function handleBannerClick() {
    banner.current.click();
  }
  return (
    <div
      ref={popup}
      className="fixed duration-200  opacity-0 pointer-events-none h-screen w-screen backdrop-brightness-50 z-40 px-2 flex items-center justify-center"
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
              className="p-2 border duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
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
                <div className="flex flex-wrap gap-1 items-center py-1">
                  {selectedTypes.map((tp, index) => (
                    <span
                      key={index}
                      className="text-sm bg-black rounded-full relative p-1  px-3 pr-7 inline-block text-white"
                    >
                      {tp.name}
                      <i
                        onClick={() => handleTypeClickRemove(tp)}
                        className="ri-close-line top-1/2 -translate-y-1/2 cursor-pointer absolute right-1 mr-1 bg-white h-4 flex items-center justify-center  w-4 rounded-full text-sm text-black"
                      ></i>
                    </span>
                  ))}
                </div>
              ) : (
                ""
              )}
              <input
                autoComplete="off"
                onChange={handleType}
                ref={type}
                onFocus={() => (dropdown_type.current.style.display = "flex")}
                className="p-2 border duration-500 border-gray-300 w-full  focus:outline-none rounded-lg text-sm"
                placeholder="Search 'T-shirt' "
                id="type"
                type="text"
              />
              <div
                ref={dropdown_type}
                style={{ boxShadow: "0 0 2px #222" }}
                className=" w-full absolute flex flex-col z-20 bg-white rounded-lg"
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
            </div>
          </div>

          <div className="border-t  flex gap-6 pt-3  border-gray-200 py-2">
            <label
              htmlFor="products"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Products
            </label>
            <div className="relative w-full">
              {selectedProducts.length != 0 ? (
                <div className="flex flex-wrap gap-1 my-1 max-h-16 overflow-scroll no-scroller items-center py-1">
                  {selectedProducts.map((tp, index) => (
                    <span
                      key={index}
                      className="text-sm bg-black max-w-40 rounded-full relative truncate p-1  px-3  pl-7 pr-7   inline-block text-white"
                    >
                      <img
                        className="inline-block text-xs h-5 w-5  absolute left-1 object-cover rounded-full top-1/2 -translate-y-1/2"
                        src={tp.imageLink}
                        alt={tp.name}
                      />
                      {tp.name}
                      <i
                        onClick={() => handleProductClickRemove(tp)}
                        className="ri-close-line top-1/2 -translate-y-1/2 cursor-pointer absolute right-1 mr-1 bg-white h-4 flex items-center justify-center  w-4 rounded-full text-sm text-black"
                      ></i>
                    </span>
                  ))}
                </div>
              ) : (
                ""
              )}
              <input
                autoComplete="off"
                onChange={handleProduct}
                onFocus={() =>
                  (dropdown_product.current.style.display = "flex")
                }
                ref={products}
                className="p-2 border duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                placeholder="Search 'Graphic Hoodie'"
                id="products"
                type="text"
              />
              <div
                ref={dropdown_product}
                style={{ boxShadow: "0 0 2px #222" }}
                className=" w-full absolute flex flex-col z-20 bg-white rounded-lg"
              >
                {fetchedProducts.map((ty, index) =>
                  selectedProducts.some((item) => item._id === ty._id) ? (
                    <p key={index} className="hidden">
                      {ty.name}
                    </p>
                  ) : (
                    <p
                      key={index}
                      onClick={() => {
                        handleProductClick(ty);
                      }}
                      className={
                        index == 0
                          ? "p-2 text-sm flex items-center gap-2 border-gray-300 hover:bg-blue-100/50 cursor-pointer capitalize"
                          : "p-2 text-sm flex items-center gap-2 border-t border-gray-300 hover:bg-blue-100/50 cursor-pointer capitalize"
                      }
                    >
                      <img
                        className="h-8 object-cover min-w-8 rounded-full border border-gray-200"
                        src={ty.imageLink}
                      />
                      <span>{ty.name}</span>
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="name flex gap-6 pt-3 border-t border-gray-200 py-2">
            <label
              htmlFor="image"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Thumbail
            </label>

            <div className="w-full relative px-5 gap-2 flex">
              <input
                className="p-2 px-2 border h-16 w-16 opacity-0 absolute border-gray-300  focus:outline-none rounded-lg text-sm"
                placeholder="Los Angeles"
                id="image"
                type="file"
                ref={thumbnail}
                required={true}
                onChange={handleThumbnailChange}
              />
              <div
                onClick={handleThumbnailClick}
                className="h-16 relative w-16 overflow-hidden rounded-full cursor-pointer border border-gray-300 flex items-center justify-center"
              >
                <i className="ri-image-add-line text-2xl"></i>
              </div>
              <img
                ref={preview}
                className="w-24 outline-none border-none object-cover z-10 opacity-0 "
              />
            </div>
          </div>

          <div className="name flex gap-6 pt-3 border-t border-gray-200 py-2">
            <label
              htmlFor="image"
              className="text-sm w-[40%] font-semibold text-gray-800"
            >
              Banner
            </label>

            <div className="w-full flex gap-2 px-5">
              <input
                className="p-2 px-2 border h-16 w-16 opacity-0 absolute border-gray-300  focus:outline-none rounded-lg text-sm"
                placeholder="Los Angeles"
                id="image"
                type="file"
                ref={banner}
                required={true}
                onChange={handleBannerChange}
              />
              <div
                onClick={handleBannerClick}
                className="h-16 relative w-16 overflow-hidden rounded-full cursor-pointer border border-gray-300 flex items-center justify-center"
              >
                <i className="ri-image-add-line text-2xl"></i>
              </div>
              <img ref={preview2} className="w-36 shadow-2xl z-10 opacity-0" />
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
