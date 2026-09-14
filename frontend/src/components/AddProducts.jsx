import { useEffect, useRef, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";

const AddProducts = ({ onProductAdded }) => {
  const [mainImage, setMainImage] = useState(null);
  const [mainFile, setMainFile] = useState(null);
  const mainImageRef = useRef(null);

  const otherImage1 = useRef(null);
  const otherImage2 = useRef(null);
  const otherImage3 = useRef(null);
  const otherImage4 = useRef(null);

  const [otherFile1, setOtherFile1] = useState(null);
  const [otherFile2, setOtherFile2] = useState(null);
  const [otherFile3, setOtherFile3] = useState(null);
  const [otherFile4, setOtherFile4] = useState(null);

  const [otherImageLink1, setOtherImageLink1] = useState(null);
  const [otherImageLink2, setOtherImageLink2] = useState(null);
  const [otherImageLink3, setOtherImageLink3] = useState(null);
  const [otherImageLink4, setOtherImageLink4] = useState(null);

  const popupRef = useRef(null);
  const addCategoryInputRef = useRef(null);
  const messageRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Dropdown options and selections
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [collections, setCollections] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");

  const fetchDropdownData = async () => {
    try {
      const [typeRes, vendorRes, colRes] = await Promise.allSettled([
        axios.get(`${import.meta.env.VITE_BASE_URL}/types`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/vendors`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/collections`),
      ]);

      if (typeRes.status === "fulfilled") {
        const tData = typeRes.value.data;
        setCategories(Array.isArray(tData?.data) ? tData.data : Array.isArray(tData) ? tData : []);
      }
      if (vendorRes.status === "fulfilled") {
        const vData = vendorRes.value.data;
        setVendors(Array.isArray(vData?.data) ? vData.data : Array.isArray(vData) ? vData : []);
      }
      if (colRes.status === "fulfilled") {
        const cData = colRes.value.data;
        setCollections(Array.isArray(cData?.data) ? cData.data : Array.isArray(cData) ? cData : []);
      }
    } catch (err) {
      console.error("Error loading dropdown data:", err);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Form inputs refs
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const sizeRef = useRef(null);
  const priceRef = useRef(null);
  const comparedPriceRef = useRef(null);
  const stockRef = useRef(null);

  useGSAP(() => {
    if (message) {
      let tl = gsap.timeline({
        onComplete: () => {
          setMessage("");
        },
      });

      tl.to(messageRef.current, {
        duration: 0.3,
        opacity: 1,
        display: "flex",
      });
      tl.to(messageRef.current, {
        duration: 0.3,
        opacity: 0,
        delay: 2.5,
        display: "none",
      });
    }
  }, [message]);

  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMainFile(file);
      setMainImage(URL.createObjectURL(file));
    }
  };
  const handleOtherImageChange1 = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOtherFile1(file);
      setOtherImageLink1(URL.createObjectURL(file));
    }
  };
  const handleOtherImageChange2 = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOtherFile2(file);
      setOtherImageLink2(URL.createObjectURL(file));
    }
  };
  const handleOtherImageChange3 = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOtherFile3(file);
      setOtherImageLink3(URL.createObjectURL(file));
    }
  };
  const handleOtherImageChange4 = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOtherFile4(file);
      setOtherImageLink4(URL.createObjectURL(file));
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const price = priceRef.current?.value;

    if (!name || !price) {
      setMessage("Product Name and Price are required!");
      return;
    }

    if (!mainFile) {
      setMessage("Main product image is required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);

    if (descriptionRef.current?.value)
      formData.append("description", descriptionRef.current.value);
    if (selectedCollection)
      formData.append("collection", selectedCollection);
    if (sizeRef.current?.value)
      formData.append("size", sizeRef.current.value);
    if (comparedPriceRef.current?.value)
      formData.append("comparedPrice", comparedPriceRef.current.value);
    if (stockRef.current?.value)
      formData.append("stock", stockRef.current.value);
    if (selectedVendor)
      formData.append("vendor", selectedVendor);
    if (selectedCategory)
      formData.append("category", selectedCategory);

    formData.append("mainImage", mainFile);
    if (otherFile1) formData.append("otherImage1", otherFile1);
    if (otherFile2) formData.append("otherImage2", otherFile2);
    if (otherFile3) formData.append("otherImage3", otherFile3);
    if (otherFile4) formData.append("otherImage4", otherFile4);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success" || response.status === 201) {
        setMessage("Product Added Successfully!");

        if (nameRef.current) nameRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";
        if (sizeRef.current) sizeRef.current.value = "";
        if (priceRef.current) priceRef.current.value = "";
        if (comparedPriceRef.current) comparedPriceRef.current.value = "";
        if (stockRef.current) stockRef.current.value = "";
        setSelectedCollection("");
        setSelectedVendor("");
        setSelectedCategory("");

        setMainFile(null);
        setMainImage(null);
        setOtherFile1(null);
        setOtherFile2(null);
        setOtherFile3(null);
        setOtherFile4(null);
        setOtherImageLink1(null);
        setOtherImageLink2(null);
        setOtherImageLink3(null);
        setOtherImageLink4(null);

        if (onProductAdded) {
          onProductAdded(response.data.data);
        }
      } else {
        setMessage(response.data.message || "Failed to add product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setMessage(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10 text-white">
      {/* Toast notification */}
      <div
        ref={messageRef}
        className="fixed top-4 right-4 z-50 bg-neutral-900 border border-emerald-500/40 text-emerald-400 text-xs font-semibold py-2.5 px-5 rounded-none shadow-2xl items-center gap-2 hidden opacity-0"
      >
        <i className="ri-information-line text-sm"></i>
        <span>{message}</span>
      </div>

      <form
        onSubmit={handleProductSubmit}
        className="w-full flex flex-col lg:flex-row gap-6 justify-center"
      >
        {/* Left Column: General Information & Pricing */}
        <div className="lg:w-3/5 w-full space-y-6">
          <div className="bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 rounded-none">
            <h2 className="text-sm font-bold font-[panchang] uppercase tracking-wider text-white mb-6 pb-3 border-b border-neutral-800">
              General Information
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  ref={nameRef}
                  className="p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 w-full focus:outline-none focus:border-white rounded-none text-xs"
                  placeholder="e.g. Heavyweight Oversized Hoodie"
                  id="name"
                  type="text"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  ref={descriptionRef}
                  className="p-2.5 min-h-28 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 w-full focus:outline-none focus:border-white rounded-none text-xs"
                  placeholder="Detailed description about the garment, cut, fit, and materials..."
                  id="description"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="collection"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5"
                  >
                    Collection Dropdown
                  </label>
                  <select
                    id="collection"
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="p-2.5 bg-neutral-950 border border-neutral-800 text-white w-full focus:outline-none focus:border-white rounded-none text-xs uppercase tracking-wider cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="">-- No Collection (Optional) --</option>
                    {collections.map((col) => (
                      <option key={col._id} value={col._id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="size"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5"
                  >
                    Sizes (Comma Separated)
                  </label>
                  <input
                    ref={sizeRef}
                    className="p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 w-full focus:outline-none focus:border-white rounded-none text-xs"
                    placeholder="S, M, L, XL, XXL"
                    id="size"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 rounded-none">
            <h2 className="text-sm font-bold font-[panchang] uppercase tracking-wider text-white mb-6 pb-3 border-b border-neutral-800">
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  ref={priceRef}
                  className="p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 w-full focus:outline-none focus:border-white rounded-none text-xs font-mono"
                  placeholder="1499.00"
                  id="price"
                  type="number"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="comparedPrice"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Compared Price (₹)
                </label>
                <input
                  ref={comparedPriceRef}
                  className="p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 w-full focus:outline-none focus:border-white rounded-none text-xs font-mono"
                  placeholder="1999.00"
                  id="comparedPrice"
                  type="number"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="stock"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Stock Quantity
                </label>
                <input
                  ref={stockRef}
                  className="p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 w-full focus:outline-none focus:border-white rounded-none text-xs font-mono"
                  placeholder="100"
                  id="stock"
                  type="number"
                  step="1"
                />
              </div>

              <div>
                <label
                  htmlFor="vendor"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Vendor / Brand Dropdown
                </label>
                <select
                  id="vendor"
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="p-2.5 bg-neutral-950 border border-neutral-800 text-white w-full focus:outline-none focus:border-white rounded-none text-xs uppercase tracking-wider cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  <option value="">-- In-House / No Vendor (Optional) --</option>
                  {vendors.map((ven) => (
                    <option key={ven._id} value={ven._id}>
                      {ven.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Imagery & Category */}
        <div className="lg:w-2/5 w-full space-y-6">
          <div className="bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 rounded-none">
            <h2 className="text-sm font-bold font-[panchang] uppercase tracking-wider text-white mb-6 pb-3 border-b border-neutral-800">
              Product Imagery
            </h2>

            {/* Main Image Upload Box */}
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Main Image <span className="text-red-500">*</span>
              </label>
              <input
                className="hidden"
                id="mainImage"
                type="file"
                accept="image/*"
                ref={mainImageRef}
                onChange={handleMainImageChange}
              />
              <button
                type="button"
                onClick={() => mainImageRef.current?.click()}
                className="relative w-full aspect-[3/4] rounded-none border border-dashed border-neutral-700 bg-neutral-950 hover:bg-neutral-900 transition flex items-center justify-center overflow-hidden group"
              >
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt="Main preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <i className="ri-image-add-line text-3xl text-neutral-500 mb-2 group-hover:text-white transition"></i>
                    <span className="text-xs font-medium text-neutral-400 group-hover:text-white transition">
                      Click to upload primary photo
                    </span>
                    <span className="text-[10px] text-neutral-600 mt-1">
                      PNG, JPG, or WEBP up to 20MB
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Additional 4 Images */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Gallery Images (Optional)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {/* Other 1 */}
                <input
                  className="hidden"
                  id="otherImage1"
                  type="file"
                  accept="image/*"
                  ref={otherImage1}
                  onChange={handleOtherImageChange1}
                />
                <button
                  type="button"
                  onClick={() => otherImage1.current?.click()}
                  className="aspect-square border border-dashed border-neutral-700 bg-neutral-950 hover:bg-neutral-900 flex items-center justify-center overflow-hidden transition relative"
                >
                  {otherImageLink1 ? (
                    <img
                      src={otherImageLink1}
                      alt="Other 1"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="ri-add-line text-neutral-500"></i>
                  )}
                </button>

                {/* Other 2 */}
                <input
                  className="hidden"
                  id="otherImage2"
                  type="file"
                  accept="image/*"
                  ref={otherImage2}
                  onChange={handleOtherImageChange2}
                />
                <button
                  type="button"
                  onClick={() => otherImage2.current?.click()}
                  className="aspect-square border border-dashed border-neutral-700 bg-neutral-950 hover:bg-neutral-900 flex items-center justify-center overflow-hidden transition relative"
                >
                  {otherImageLink2 ? (
                    <img
                      src={otherImageLink2}
                      alt="Other 2"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="ri-add-line text-neutral-500"></i>
                  )}
                </button>

                {/* Other 3 */}
                <input
                  className="hidden"
                  id="otherImage3"
                  type="file"
                  accept="image/*"
                  ref={otherImage3}
                  onChange={handleOtherImageChange3}
                />
                <button
                  type="button"
                  onClick={() => otherImage3.current?.click()}
                  className="aspect-square border border-dashed border-neutral-700 bg-neutral-950 hover:bg-neutral-900 flex items-center justify-center overflow-hidden transition relative"
                >
                  {otherImageLink3 ? (
                    <img
                      src={otherImageLink3}
                      alt="Other 3"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="ri-add-line text-neutral-500"></i>
                  )}
                </button>

                {/* Other 4 */}
                <input
                  className="hidden"
                  id="otherImage4"
                  type="file"
                  accept="image/*"
                  ref={otherImage4}
                  onChange={handleOtherImageChange4}
                />
                <button
                  type="button"
                  onClick={() => otherImage4.current?.click()}
                  className="aspect-square border border-dashed border-neutral-700 bg-neutral-950 hover:bg-neutral-900 flex items-center justify-center overflow-hidden transition relative"
                >
                  {otherImageLink4 ? (
                    <img
                      src={otherImageLink4}
                      alt="Other 4"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="ri-add-line text-neutral-500"></i>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 rounded-none">
            <h2 className="text-sm font-bold font-[panchang] uppercase tracking-wider text-white mb-6 pb-3 border-b border-neutral-800">
              Product Category
            </h2>

            <div>
              <label
                htmlFor="category"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5"
              >
                Category Dropdown
              </label>
              <div className="flex gap-2">
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-2.5 bg-neutral-950 border border-neutral-800 text-white flex-1 focus:outline-none focus:border-white rounded-none text-xs uppercase tracking-wider cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    popupRef.current.classList.remove("hidden");
                    popupRef.current.classList.add("flex");
                  }}
                  className="px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-white rounded-none transition whitespace-nowrap"
                  style={{ borderRadius: 0 }}
                >
                  + New
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-widest transition rounded-none disabled:opacity-50 shadow-xl"
                style={{ borderRadius: 0 }}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i> Saving Product...
                  </span>
                ) : (
                  "Create & Publish Product"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* New Category Modal */}
      <div
        ref={popupRef}
        className="fixed inset-0 bg-black/70 z-50 hidden px-4 items-center backdrop-blur-sm justify-center"
      >
        <div className="bg-neutral-900 border border-neutral-800 max-w-sm w-full p-6 rounded-none shadow-2xl">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-800 mb-4">
            <div>
              <h3 className="text-sm font-bold font-[panchang] uppercase text-white">
                Add Category
              </h3>
              <p className="text-[11px] text-neutral-400">
                Register a new apparel category
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                popupRef.current.classList.remove("flex");
                popupRef.current.classList.add("hidden");
              }}
              className="text-neutral-400 hover:text-white"
            >
              <i className="ri-close-fill text-xl"></i>
            </button>
          </div>

          <div className="space-y-4">
            <input
              ref={addCategoryInputRef}
              minLength={3}
              type="text"
              placeholder="e.g. Knitwear, Accessories"
              className="p-2.5 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 w-full focus:outline-none focus:border-white text-xs rounded-none"
            />
            <button
              type="button"
              onClick={() => {
                let category = addCategoryInputRef.current.value;
                if (category.trim() !== "") {
                  axios
                    .post(
                      `${import.meta.env.VITE_BASE_URL}/types/add`,
                      { category },
                      { withCredentials: true }
                    )
                    .then((response) => {
                      setMessage(response.data.message || "Category created successfully!");
                      popupRef.current.classList.remove("flex");
                      popupRef.current.classList.add("hidden");
                      const newCat = response.data?.data;
                      if (newCat) {
                        setCategories((prev) => [...prev, newCat]);
                        setSelectedCategory(newCat._id);
                      } else {
                        fetchDropdownData();
                      }
                      addCategoryInputRef.current.value = "";
                    })
                    .catch((error) => {
                      console.error("Error adding category:", error);
                      setMessage("Failed to create category");
                    });
                }
              }}
              className="w-full bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider py-2.5 rounded-none transition"
              style={{ borderRadius: 0 }}
            >
              Save Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;