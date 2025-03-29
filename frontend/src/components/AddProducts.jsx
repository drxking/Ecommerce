import { useRef, useState } from "react"

const AddProducts = () => {

    const [mainImage, setMainImage] = useState(null)
    const mainImageRef = useRef(null)
    const otherImage1 = useRef(null)
    const otherImage2 = useRef(null)
    const otherImage3 = useRef(null)
    const otherImage4 = useRef(null)

    const [otherImageLink1, setOtherImageLink1] = useState(null)
    const [otherImageLink2, setOtherImageLink2] = useState(null)
    const [otherImageLink3, setOtherImageLink3] = useState(null)
    const [otherImageLink4, setOtherImageLink4] = useState(null)

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
        <div>
            <form className="pt-5 w-full flex gap-5 px-10 border-t border-gray-200">
                <div className="w-2/3">
                    <div className="bg-gray-100/50 p-6 rounded-2xl">
                        <div className="name flex  gap-6 w-full  py-2">
                            <label
                                htmlFor="name"
                                className="text-sm w-[40%] font-semibold text-gray-800"
                            >
                                Product Name
                            </label>
                            <input
                                className="p-2 border duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                placeholder="eg: Nike Air Max"
                                id="name"
                                type="text"
                            />
                        </div>
                        <div className="description flex border-t gap-6 pt-3 w-full border-gray-200 py-2">
                            <label
                                htmlFor="description"
                                className="text-sm w-[40%] font-semibold text-gray-800"
                            >
                                Description
                            </label>
                            <textarea
                                className="p-2 border no-scroller  border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                placeholder="A comfortable and stylish running shoe"
                                id="description"
                                rows="3"
                                onInput={(e) => {
                                    e.target.style.height = "auto";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                            ></textarea>
                        </div>
                        <div className="price flex border-t gap-6 pt-3 items-center w-full border-gray-200 py-2">
                            <label
                                htmlFor="price"
                                className="text-sm w-[40%] font-semibold text-gray-800"
                            >
                                Price
                            </label>
                            <input
                                className="p-2 border duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                placeholder="120.00"
                                id="price"
                                type="number"
                                step="0.01"
                            />
                        </div>
                        <div className="compared-price flex border-t gap-6 pt-3 items-center w-full border-gray-200 py-2">
                            <label
                                htmlFor="comparedPrice"
                                className="text-sm w-[40%] font-semibold text-gray-800"
                            >
                                Compared Price
                            </label>
                            <input
                                className="p-2 border duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                placeholder="150.00"
                                id="comparedPrice"
                                type="number"
                                step="0.01"
                            />
                        </div>
                        <div className="category flex border-t gap-6 pt-3 items-center w-full border-gray-200 py-2">
                            <label
                                htmlFor="type"
                                className="text-sm w-[40%] font-semibold text-gray-800"
                            >
                                Type
                            </label>
                            <input
                                className="p-2 border duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                placeholder="Footwear"
                                id="type"
                                type="text"
                            />
                        </div>
                        <div className="collection flex border-t gap-6 pt-3 items-center w-full border-gray-200 py-2">
                            <label
                                htmlFor="collection"
                                className="text-sm w-[40%] font-semibold text-gray-800"
                            >
                                Collection
                            </label>
                            <input
                                className="p-2 border duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                placeholder="Summer Collection"
                                id="collection"
                                type="text"
                            />
                        </div>
                        <div className="size flex border-t gap-6 pt-3 items-center w-full border-gray-200 py-2">
                            <label
                                htmlFor="size"
                                className="text-sm w-[40%] font-semibold text-gray-800"
                            >
                                Size
                            </label>
                            <input
                                className="p-2 border duration-500 border-gray-300 w-full focus:outline-none rounded-lg text-sm"
                                placeholder="M, L, XL"
                                id="size"
                                type="text"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-1/3">
                    <div className="bg-gray-100/50 p-6 rounded-2xl">
                        <div className="main-image flex flex-col  gap-2  w-full">
                            <label
                                htmlFor="mainImage"
                                className="text-sm w-[40%] font-semibold text-gray-800"
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
                                    <span className="text-3xl text-gray-500 border-gray-300 leading-none h-14 w-14 text-center content-center border-dotted border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute text-center rounded-full" >+</span>
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
                                    } }

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
                </div>
            </form>
        </div>
    )
}

export default AddProducts