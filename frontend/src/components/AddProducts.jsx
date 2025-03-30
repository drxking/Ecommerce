import { useEffect, useRef, useState } from "react"
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


const AddProducts = () => {

    const [mainImage, setMainImage] = useState(null)
    const mainImageRef = useRef(null)
    const otherImage1 = useRef(null)
    const otherImage2 = useRef(null)
    const otherImage3 = useRef(null)
    const otherImage4 = useRef(null)
    const popupRef = useRef(null)
    const addCategoryInputRef = useRef(null)
    const messageRef = useRef(null)


    const [otherImageLink1, setOtherImageLink1] = useState(null)
    const [otherImageLink2, setOtherImageLink2] = useState(null)
    const [otherImageLink3, setOtherImageLink3] = useState(null)
    const [otherImageLink4, setOtherImageLink4] = useState(null)
    const [message, setMessage] = useState("")



    useGSAP(() => {
        if (message) {
            let tl = gsap.timeline({
                onComplete: () => {
                    setMessage("")
                }
            });

            tl.to(messageRef.current, {
                duration: 0.3,
                opacity: 1,
                display: "flex"
            })
            tl.to(messageRef.current, {
                duration: 0.3,
                opacity: 0,
                delay: 2,
                display: "none"
            })
        }

    }, [message])

    const handleMainImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setMainImage(URL.createObjectURL(file))
        }
    }
    const handleOtherImageChange1 = (event) => {
        const file = event.target.files[0]
        if (file) {
            setOtherImageLink1(URL.createObjectURL(file))
        }
    }
    const handleOtherImageChange2 = (event) => {
        const file = event.target.files[0]
        if (file) {
            setOtherImageLink2(URL.createObjectURL(file))
        }
    }
    const handleOtherImageChange3 = (event) => {
        const file = event.target.files[0]
        if (file) {
            setOtherImageLink3(URL.createObjectURL(file))
        }
    }
    const handleOtherImageChange4 = (event) => {
        const file = event.target.files[0]
        if (file) {
            setOtherImageLink4(URL.createObjectURL(file))
        }
    }



    return (
        <div className="pb-10">
            <h1 ref={messageRef} className="text-sm z-40 bg-[#A0EDA8] font-medium capitalize fixed top-2 p-2 px-4 rounded-xl right-2 text-black hidden opacity-0">{message}</h1>

            <form className="pt-5 w-full flex flex-col md:flex-row  gap-5 justify-center md:px-0 lg:px-10  px-0 border-t border-gray-200">
                <div className="md:w-2/4 w-full">
                    <div className="bg-gray-100/50 p-6 rounded-2xl">
                        <div >
                            <h1 className="text-md font-semibold my-3">General Information</h1>
                            <div className="name flex flex-col  gap-2 w-full  py-1">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Product Name
                                </label>
                                <input
                                    className="p-2 duration-500 bg-gray-200 w-full focus:outline-none rounded-lg text-sm"
                                    placeholder="eg: Nike Air Max"
                                    id="name"
                                    type="text"
                                />
                            </div>
                            <div className="description flex flex-col border-t gap-2  w-full border-gray-200 py-1">
                                <label
                                    htmlFor="description"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Description
                                </label>
                                <textarea
                                    className="p-2 no-scroller min-h-36 bg-gray-200 w-full focus:outline-none rounded-lg text-sm"
                                    placeholder="A comfortable and stylish running shoe"
                                    id="description"
                                    rows="3"
                                    onInput={(e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                ></textarea>
                            </div>
                            <div className="collection flex flex-col border-t gap-2  w-full border-gray-200 py-1">
                                <label
                                    htmlFor="collection"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Collection
                                </label>
                                <input
                                    className="p-2  duration-500 bg-gray-200  w-full focus:outline-none rounded-lg text-sm"
                                    placeholder="Summer Collection"
                                    id="collection"
                                    type="text"
                                />
                            </div>
                            <div className="size flex flex-col border-t gap-2 w-full border-gray-200 py-1">
                                <label
                                    htmlFor="size"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Size
                                </label>
                                <input
                                    className="p-2  duration-500 bg-gray-200  w-full focus:outline-none rounded-lg text-sm"
                                    placeholder="M, L, XL"
                                    id="size"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100/50 p-6 rounded-2xl mt-5">
                        <h1 className="text-md font-semibold my-3">Pricing and Stock</h1>

                        <div className="flex gap-4">
                            <div className="price flex flex-col gap-2  w-full border-gray-200 py-1">
                                <label
                                    htmlFor="price"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Price
                                </label>
                                <input
                                    className="p-2  duration-500 bg-gray-200  w-full focus:outline-none rounded-lg text-sm"
                                    placeholder="120.00"
                                    id="price"
                                    type="number"
                                    step="0.01"
                                />
                            </div>
                            <div className="compared-price flex flex-col  gap-2  w-full border-gray-200 py-1">
                                <label
                                    htmlFor="comparedPrice"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Compared Price
                                </label>
                                <input
                                    className="p-2  duration-500 bg-gray-200 w-full focus:outline-none rounded-lg text-sm"
                                    placeholder="150.00"
                                    id="comparedPrice"
                                    type="number"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="price flex flex-col gap-2  w-full border-gray-200 py-1">
                                <label
                                    htmlFor="stock"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Stock
                                </label>
                                <input
                                    className="p-2  duration-500 bg-gray-200 w-full focus:outline-none rounded-lg text-sm"
                                    placeholder="1100"
                                    id="stock"
                                    type="number"
                                    step="1"
                                />
                            </div>
                            <div className="price flex flex-col gap-2  w-full border-gray-200 py-1">
                                <label
                                    htmlFor="vendor"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Vendor
                                </label>
                                <input
                                    className="p-2  duration-500 bg-gray-200 w-full focus:outline-none rounded-lg text-sm"
                                    placeholder="Nike"
                                    id="vendor"
                                    type="text"
                                    step="1"
                                />
                            </div>
                        </div>
                    </div>


                </div>

                <div className="md:w-1/3 w-full">
                    <div className="bg-gray-100/50 p-6 rounded-2xl">
                        <div className="main-image flex flex-col  gap-2  w-full">
                            <label
                                htmlFor="mainImage"
                                className="text-md font-semibold text-gray-800"
                            >
                                Upload Image
                            </label>

                            <input
                                className="p-2 hidden border-2 duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                id="mainImage"
                                type="file"
                                accept="image/*"
                                ref={mainImageRef}
                                onChange={(e) => {
                                    handleMainImageChange(e)
                                    mainImageRef.current.value = null
                                }}
                            />

                            <div className="w-full ">

                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById("mainImage").click()
                                    }
                                    }
                                    className=" relative  w-full aspect-square focus:outline-none justify-center items-center rounded-2xl border-2 border-dotted border-gray-300 bg-gray-100/50 hover:bg-gray-100 text-gray-800"
                                >
                                    <div className="preview w-full h-full absolute top-0 z-10">
                                        {
                                            (mainImage ? <img src={mainImage} className="w-full h-full object-cover rounded-2xl scale-[102%]" loading="lazy" style={{ imageRendering: "auto" }} /> : "")
                                        }
                                    </div>
                                    <span className="text-3xl text-gray-500 border-gray-300 leading-none h-14 w-14 text-center content-center border-dotted border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute rounded-full" >+</span>
                                </button>
                            </div>
                        </div>
                        <div className="other-images flex  gap-6 pt-3 w-full  pb-2">

                            <input
                                className="p-2 hidden border duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                id="otherImages"
                                type="file"
                                accept="image/*"
                                multiple
                            />
                            <div className="w-full flex gap-2">
                                <input
                                    className="p-2 hidden border-2 duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                    id="otherImage1"
                                    type="file"
                                    accept="image/*"
                                    ref={otherImage1}
                                    onChange={(e) => {
                                        handleOtherImageChange1(e)
                                    }}

                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById("otherImage1").click()
                                    }
                                    }
                                    className="w-24 relative aspect-square flex focus:outline-none justify-center items-center rounded-lg border-2 border-dotted border-gray-300 bg-gray-100/50 hover:bg-gray-100 text-gray-800"
                                >
                                    {
                                        (otherImageLink1 ? <img src={otherImageLink1} className="w-full h-full object-cover absolute rounded-lg scale-[102%]" loading="lazy" style={{ imageRendering: "auto" }} /> : "")
                                    }
                                    <span className="text-xl content-center  text-gray-500 leading-none h-8 w-8 text-center rounded-full">+</span>
                                </button>
                                <input
                                    className="p-2 hidden border-2 duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                    id="otherImage2"
                                    type="file"
                                    accept="image/*"
                                    ref={otherImage2}
                                    onChange={(e) => {
                                        handleOtherImageChange2(e)
                                    }}

                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById("otherImage2").click()
                                    }
                                    }
                                    className="w-24 relative aspect-square flex focus:outline-none justify-center items-center rounded-lg border-2 border-dotted border-gray-300 bg-gray-100/50 hover:bg-gray-100 text-gray-800"
                                >
                                    {
                                        (otherImageLink2 ? <img src={otherImageLink2} className="w-full h-full object-cover absolute rounded-lg scale-[102%]" loading="lazy" style={{ imageRendering: "auto" }} /> : "")
                                    }
                                    <span className="text-xl content-center  text-gray-500 leading-none h-8 w-8 text-center rounded-full">+</span>
                                </button>
                                <input
                                    className="p-2 hidden border-2 duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                    id="otherImage3"
                                    type="file"
                                    accept="image/*"
                                    ref={otherImage3}
                                    onChange={(e) => {
                                        handleOtherImageChange3(e)
                                    }}

                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById("otherImage3").click()
                                    }
                                    }
                                    className="w-24 relative aspect-square flex focus:outline-none justify-center items-center rounded-lg border-2 border-dotted border-gray-300 bg-gray-100/50 hover:bg-gray-100 text-gray-800"
                                >
                                    {
                                        (otherImageLink3 ? <img src={otherImageLink3} className="w-full h-full object-cover absolute rounded-lg scale-[102%]" loading="lazy" style={{ imageRendering: "auto" }} /> : "")
                                    }
                                    <span className="text-xl content-center  text-gray-500 leading-none h-8 w-8 text-center rounded-full">+</span>
                                </button>
                                <input
                                    className="p-2 hidden border-2 duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                    id="otherImage4"
                                    type="file"
                                    accept="image/*"
                                    ref={otherImage4}
                                    onChange={(e) => {
                                        handleOtherImageChange4(e)
                                    }
                                    }

                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById("otherImage4").click()
                                    }

                                    }
                                    className="w-24 relative aspect-square flex focus:outline-none justify-center items-center rounded-lg border-2 border-dotted border-gray-300 bg-gray-100/50 hover:bg-gray-100 text-gray-800"
                                >
                                    {
                                        (otherImageLink4 ? <img src={otherImageLink4} className="w-full h-full object-cover absolute rounded-lg scale-[102%]" loading="lazy" style={{ imageRendering: "auto" }} /> : "")
                                    }
                                    <span className="text-xl content-center  text-gray-500 leading-none h-8 w-8 text-center rounded-full">+</span>
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100/50 p-6 rounded-2xl mt-5">
                        <h1 className="text-md font-semibold my-3">Category</h1>

                        <div className="flex gap-4">
                            <div className="price flex flex-col gap-2  w-full border-gray-200 py-1">
                                <label
                                    htmlFor="category"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Product Category
                                </label>
                                <input
                                    className="p-2  duration-500 bg-gray-200  w-full focus:outline-none rounded-lg text-sm"
                                    placeholder="Jacket"
                                    id="category"
                                    type="text"
                                />
                            </div>


                        </div>
                        <p onClick={() => {
                            popupRef.current.classList.remove("hidden")
                            popupRef.current.classList.add("flex")
                        }} className="mt-3 inline-block cursor-pointer text-sm focus:outline-none rounded-full bg-[#A0EDA8] text-black font-semibold py-2 px-4">
                            Add Category
                        </p>

                    </div>
                </div>
            </form>
            <div ref={popupRef} className="popup fixed top-0 left-0 w-full h-full bg-gray-900/50 z-20 hidden px-8 items-center backdrop-blur-sm justify-center ">

                <div className="bg-white lg:w-1/4 md:w-1/3 sm:w-1/2 w-full relative pb-8 pt-6 rounded-3xl flex flex-col justify-center ">
                    <div className="flex justify-between items-center px-5">
                        <div className="text-xl font-semibold text-gray-800">
                            Add Category
                            <div className="text-xs tracking-wide font-medium text-gray-400">
                                Add a new category to your store
                            </div>
                        </div>

                        <div className="cursor-pointer" onClick={() => {
                            popupRef.current.classList.remove("flex")
                            popupRef.current.classList.add("hidden")
                        }}>
                            <i className="ri-close-fill text-xl"></i>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full px-5 mt-5">
                        <input ref={addCategoryInputRef} minLength={3} type="text" placeholder="Category Name" className="p-2 duration-500 bg-gray-200 w-full focus:outline-none rounded-lg text-sm" />
                        <button onClick={() => {
                            let category = addCategoryInputRef.current.value;
                            if (category.trim() !== "") {
                                axios.post(`${import.meta.env.VITE_BASE_URL}/types/add`, { category }, {
                                    withCredentials: true,
                                })
                                    .then(response => {
                                        setMessage(response.data.message)
                                        console.log("Category added successfully:", response.data);
                                        popupRef.current.classList.remove("flex");
                                        popupRef.current.classList.add("hidden");
                                        addCategoryInputRef.current.value = "";
                                    })
                                    .catch(error => {
                                        console.error("Error adding category:", error);
                                    });
                            } else {
                                console.error("Category name cannot be empty");
                            }
                        }} className="bg-[#A0EDA8] text-sm text-black font-semibold py-2 px-4 rounded-full">
                            Add Category
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AddProducts