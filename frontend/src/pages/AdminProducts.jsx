import React, { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'
import AddProducts from '../components/AddProducts'

const AdminProducts = () => {

    const [addProductsToggle, setAddProductsToggle] = useState(false)
    let toggleProductsToggle = () => {
        setAddProductsToggle(!addProductsToggle)
    }
    useEffect(() => {
        console.log(addProductsToggle)
    })
    return (
        <>
            <AdminNav />
            <div className='px-4 md:px-5'> 
            <div className="hero flex items-center justify-between py-4 ">
                <h2 className="font-[900] flex md:flex-row flex-col md:gap-3 md:text-2xl  uppercase">
                    {
                        (addProductsToggle)?<>
                        <p className="font-[panchang] leading-[1]">Add</p>
                        <p className="font-[panchang] leading-[1]">Products</p></>:
                        <>
                        <p className="font-[panchang] leading-[1]">Your</p>
                        <p className="font-[panchang] leading-[1]">Products</p></>
                    }
                </h2>
                <button onClick={toggleProductsToggle} className='inline-block z-20 text-white md:text-base text-sm relative font-semibold overflow-hidden px-3 focus:outline-none leading-none rounded-full '>
                    <img
                        src="/mask2.webp"
                        className="w-full h-full brightness-[85%] object-cover -z-10 absolute top-0 left-0"
                    />
                    {
                        (addProductsToggle)?<p className="text-white md:text-base text-sm relative font-semibold overflow-hidden px-3 py-2  leading-none rounded-full ">
                        Close
                    </p>:<p className="text-white md:text-base text-sm relative font-semibold overflow-hidden px-3 py-2  leading-none rounded-full ">
                        Add Product
                    </p>
                    }
                </button>
            </div>
            {
                (addProductsToggle) ? <AddProducts /> : <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 py-4">
                        {/* Example card */}
                        {[...Array(10)].map((_, index) => (
                            <div key={index} className="bg-gray-200  p-4 h-80">
                                <h3 className="font-bold text-lg">Product {index + 1}</h3>
                                <p className="text-sm text-gray-600">Description of the product.</p>
                            </div>
                        ))}
                    </div></>
            }
            </div>

        </>
    )
}

export default AdminProducts