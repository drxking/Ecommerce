import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const AddCollection = ({ open, handleClose, handleUpload }) => {
  const [submitted, setSubmitted] = useState(false);
  const [fetchedTypes, setfetchedTypes] = useState([]);
  const [selectedTypes, setselectedTypes] = useState([]);

  const [fetchedProducts, setfetchedProducts] = useState([]);
  const [selectedProducts, setselectedProducts] = useState([]);
  const [thumbnails, setthumbnails] = useState();

  let name = useRef(); 
  let description = useRef();
  let type = useRef();
  let products = useRef();
  let dropdown_type = useRef();
  let thumbnail = useRef();
  let preview = useRef();
  let dropdown_product = useRef();

  const popup = useRef(null);

  useEffect(() => {
    if (open) {
      popup.current.style.opacity = 1;
      popup.current.style.pointerEvents = "unset";
    } else {
      popup.current.style.opacity = 0;
      popup.current.style.pointerEvents = "none";
      clearForm();
    }
  }, [open]);

  function clearForm() {
    name.current.value = "";
    if (description.current) description.current.value = "";
    type.current.value = "";
    products.current.value = "";
    preview.current.src = "";
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
    formData.append("name", name.current.value);
    if (description.current?.value) {
      formData.append("description", description.current.value);
    }

    let shouldSendType = selectedTypes.map((e) => {
      return e._id;
    });
    let shouldSendProduct = selectedProducts.map((e) => {
      return e._id;
    });

    shouldSendType.forEach((i) => {
      formData.append("type[]", i);
    });
    shouldSendProduct.forEach((i) => {
      formData.append("products[]", i);
    });

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
            Add Collection
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <i className="ri-close-line text-2xl leading-none"></i>
          </button>
        </div>

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
              placeholder="e.g. Mens Collection"
              id="name"
              type="text"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="description flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-t border-neutral-800 pt-3">
            <label
              htmlFor="description"
              className="text-xs uppercase tracking-wider w-full sm:w-[35%] font-semibold text-neutral-300"
            >
              Description
            </label>
            <textarea
              ref={description}
              className="p-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 w-full focus:outline-none focus:border-white text-xs rounded-none transition"
              placeholder="Collection description for storefront..."
              id="description"
              rows="2"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 border-t border-neutral-800 pt-3">
            <label
              htmlFor="type"
              className="text-xs uppercase tracking-wider w-full sm:w-[35%] font-semibold text-neutral-300 pt-1"
            >
              Type
            </label>
            <div className="w-full relative">
              {selectedTypes.length !== 0 && (
                <div className="flex flex-wrap gap-1.5 items-center pb-2">
                  {selectedTypes.map((tp, index) => (
                    <span
                      key={index}
                      className="text-xs bg-neutral-800 border border-neutral-700 text-neutral-200 px-2.5 py-1 inline-flex items-center gap-1.5 rounded-none"
                      style={{ borderRadius: 0 }}
                    >
                      {tp.name}
                      <i
                        onClick={() => handleTypeClickRemove(tp)}
                        className="ri-close-line cursor-pointer bg-neutral-700 hover:bg-white hover:text-black h-3.5 w-3.5 flex items-center justify-center text-[10px] transition"
                      ></i>
                    </span>
                  ))}
                </div>
              )}
              <input
                autoComplete="off"
                onChange={handleType}
                ref={type}
                onFocus={() => (dropdown_type.current.style.display = "flex")}
                className="p-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 w-full focus:outline-none focus:border-white text-xs rounded-none transition"
                placeholder="Search 'T-shirt'..."
                id="type"
                type="text"
                style={{ borderRadius: 0 }}
              />
              <div
                ref={dropdown_type}
                className="w-full absolute flex flex-col z-30 bg-neutral-900 border border-neutral-800 shadow-2xl max-h-40 overflow-y-auto rounded-none mt-1"
                style={{ borderRadius: 0, display: "none" }}
              >
                {fetchedTypes.map((ty, index) =>
                  selectedTypes.some((item) => item._id === ty._id) ? null : (
                    <p
                      key={index}
                      onClick={() => handleTypeClick(ty)}
                      className="p-2.5 text-xs text-neutral-200 border-b border-neutral-800/60 hover:bg-neutral-800 cursor-pointer capitalize last:border-0"
                    >
                      {ty.name}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 pt-3">
            <label
              htmlFor="products"
              className="text-xs uppercase tracking-wider w-full sm:w-[35%] font-semibold text-neutral-300 pt-1"
            >
              Products
            </label>
            <div className="relative w-full">
              {selectedProducts.length !== 0 && (
                <div className="flex flex-wrap gap-1.5 pb-2 max-h-20 overflow-y-auto items-center">
                  {selectedProducts.map((tp, index) => (
                    <span
                      key={index}
                      className="text-xs bg-neutral-800 border border-neutral-700 text-neutral-200 px-2 py-1 inline-flex items-center gap-1.5 max-w-[160px] truncate rounded-none"
                      style={{ borderRadius: 0 }}
                    >
                      <img
                        className="h-4 w-4 object-cover rounded-none"
                        src={tp.imageLink}
                        alt={tp.name}
                      />
                      <span className="truncate">{tp.name}</span>
                      <i
                        onClick={() => handleProductClickRemove(tp)}
                        className="ri-close-line cursor-pointer bg-neutral-700 hover:bg-white hover:text-black h-3.5 w-3.5 flex items-center justify-center text-[10px] transition"
                      ></i>
                    </span>
                  ))}
                </div>
              )}
              <input
                autoComplete="off"
                onChange={handleProduct}
                onFocus={() =>
                  (dropdown_product.current.style.display = "flex")
                }
                ref={products}
                className="p-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 w-full focus:outline-none focus:border-white text-xs rounded-none transition"
                placeholder="Search 'Graphic Hoodie'..."
                id="products"
                type="text"
                style={{ borderRadius: 0 }}
              />
              <div
                ref={dropdown_product}
                className="w-full absolute flex flex-col z-30 bg-neutral-900 border border-neutral-800 shadow-2xl max-h-40 overflow-y-auto rounded-none mt-1"
                style={{ borderRadius: 0, display: "none" }}
              >
                {fetchedProducts.map((ty, index) =>
                  selectedProducts.some((item) => item._id === ty._id) ? null : (
                    <p
                      key={index}
                      onClick={() => handleProductClick(ty)}
                      className="p-2.5 text-xs flex items-center gap-2 border-b border-neutral-800/60 hover:bg-neutral-800 cursor-pointer capitalize text-neutral-200 last:border-0"
                    >
                      <img
                        className="h-6 w-6 object-cover border border-neutral-700"
                        src={ty.imageLink}
                        alt=""
                      />
                      <span>{ty.name}</span>
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="name flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-3 border-t border-neutral-800">
            <label
              htmlFor="image"
              className="text-xs uppercase tracking-wider w-full sm:w-[35%] font-semibold text-neutral-300"
            >
              Thumbnail <span className="text-red-400">*</span>
            </label>

            <div className="w-full relative flex items-center gap-3">
              <input
                className="hidden"
                id="image"
                type="file"
                ref={thumbnail}
                required={true}
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              <div
                onClick={handleThumbnailClick}
                className="h-16 w-16 cursor-pointer border border-dashed border-neutral-700 hover:border-white bg-neutral-950 flex flex-col items-center justify-center text-neutral-400 hover:text-white transition rounded-none"
                style={{ borderRadius: 0 }}
                title="Click to select thumbnail"
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
              Add Collection
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

export default AddCollection;
