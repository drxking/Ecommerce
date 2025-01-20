import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

let links = [
  {
    name: "Men",
    link: "/men",
  },
  {
    name: "Women",
    link: "/women",
  },
  {
    name: "Kids",
    link: "/kids",
  },
  {
    name: "Featured",
    link: "/sale",
  },
];


const Home = () => {
  let [product, setProduct] = useState([]);
  let mainImage = useRef(null);
  const params = useParams();
  useEffect(() => {
    async function fetcher() {
      let products = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products/${params.id}`
      );
      setProduct(products.data);
    }
    fetcher();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll on page navigation
  }, [location]);

  function handleClick(e) {
    mainImage.current.src = e.target.src;
  }
  return (
    <>
      <Navbar links={links}/>

      <div className="lg:px-32 md:px-20 sm:px-10 px-5  py-5">
        <div className="top">
          <p className="text-sm font-medium text-gray-500 py-3">
            Clothes and shoes • Shoes • Nike
          </p>
        </div>
        <div className="bottom flex flex-col md:flex-row  gap-4 md:gap-0">
          <div className="left flex flex-col w-full  md:w-1/2">
            <div className="img-wrapper image-loader relative w-full h-[115vw] md:w-[36vw] md:h-[38vw] rounded-3xl overflow-hidden">
              <img
                ref={mainImage}
                src={product?.imageLink}
                className="object-cover w-full h-full"
                alt={product?.imageLink}
              />
              <div className="overlay w-full h-full bg-[linear-gradient(transparent,rgba(0,0,0,0.1))] absolute top-0 "></div>
            </div>
          </div>
          <div className="right w-full  md:w-[50%]">
            <div className="flex justify-between">
              <div className="left flex items-center gap-2">
                <img
                  className="w-7 h-7 object-cover rounded-full"
                  src={product?.vendor?.imageLink}
                  alt=""
                />
                <p className="font-semibold text-sm">{product?.vendor?.name}</p>
              </div>
              <div className="text-sm text-gray-500 font-semibold right">
                {product?.views} People viewed
              </div>
            </div>
            <div className="py-5">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex py-1 items-center gap-2">
                <div className=" flex text-[#e0be4c] items-center">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-line"></i>
                </div>
                <p className="font-semibold text-sm text-gray-500">
                  52 reviews
                </p>
              </div>
            </div>
            <div>
              <p className="text-4xl font-semibold">${product.price}</p>
            </div>
            <div className="py-5 ">
              <p className="p-1 text-sm font-semibold text-gray-600">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product?.size?.map((e, index) => (
                  <button
                    key={index}
                    className="text-md px-5 py-1 border rounded-lg"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 w-full overflow-x-scroll md:overflow-x-auto no-scroller">
              {product?.otherImageLink?.map((e, index) => (
                <img
                  onClick={handleClick}
                  className="w-28 h-32 smooth cursor-pointer object-cover rounded-xl border border-gray-200"
                  key={index}
                  src={e}
                ></img>
              ))}
            </div>
            <div className="py-4">
              <button className="bg-black w-full text-white py-2 rounded-xl">
                Add to Cart
              </button>
              <p className="text-sm font-bold p-2 text-gray-500 flex gap-1">
                <i className="ri-truck-line "></i>
                Free delivery on orders over $30.0
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-2xl font-semibold">Customer Reviews</p>
          <div className="user mt-10">
            <div className=" flex text-[#e0be4c] items-center">
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-line"></i>
            </div>
            <div className="p-2 flex items-center gap-2">
              <div className="h-8 w-8 bg-black rounded-full overflow-hidden">
                <img
                  className="h-full w-full object-cover"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScqWFBV1tVueNmwvGdjg5LbsLEoIc6N-9GhQ&s"
                  alt=""
                />
              </div>
              <p className=" font-semibold">Jon Snow</p>
            </div>
            <div>
              <p className="px-10 font-medium text-sm">
                I recently purchased this product and I must say, I am really
                impressed with its quality. The design is sleek and modern, and
                it performs as advertised. The only reason I didn't give it 5
                stars is because the shipping took a bit longer than expected.
                However, the product itself is fantastic and totally worth the
                price!
              </p>
            </div>
          </div>

          <div className="user mt-10">
            <div className=" flex text-[#e0be4c] items-center">
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-line"></i>
              <i className="ri-star-line"></i>
            </div>
            <div className="p-2 flex items-center gap-2">
              <div className="h-8 w-8 bg-black rounded-full overflow-hidden">
                <img
                  className="h-full w-full object-cover"
                  src="https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/08/25/12/4.png"
                  alt=""
                />
              </div>
              <p className=" font-semibold">Bran Stark</p>
            </div>
            <div>
              <p className="px-10 font-medium text-sm">
                The product is decent, but I expected better quality for the
                price. It works fine for basic tasks, but the durability seems
                questionable. After a few uses, I noticed some wear and tear.
                I’m hoping it holds up a bit longer, but overall, it's an okay
                purchase if you're on a budget.
              </p>
            </div>
          </div>

          <div className="user mt-10">
            <div className=" flex text-[#e0be4c] items-center">
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-line"></i>
              <i className="ri-star-line"></i>
              <i className="ri-star-line"></i>
            </div>
            <div className="p-2 flex items-center gap-2">
              <div className="h-8 w-8 bg-black rounded-full overflow-hidden">
                <img
                  className="h-full w-full object-cover"
                  src="https://westiswesteros.wordpress.com/wp-content/uploads/2017/07/tormund.jpg?w=265&h=390"
                  alt=""
                />
              </div>
              <p className=" font-semibold">Tormund Gaintbane</p>
            </div>
            <div>
              <p className="px-10 font-medium text-sm">
                I absolutely love this product! The build quality is top-notch,
                and it functions flawlessly. It's exactly what I was looking
                for. The setup was easy, and it works perfectly every time I use
                it. Highly recommend this to anyone looking for something
                reliable and well-built. Worth every penny!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
