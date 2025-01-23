import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "../components/Logo";

const Login = () => {
  let navigate = useNavigate();
  const [submitted, setsubmitted] = useState(false);
  let [error, seterror] = useState(null);
  let [responsed, setResponsed] = useState(null);

  let mail = useRef(null);
  let pass = useRef(null);

  let blink = useRef(null);
  let isInitialRender = useRef(true);

  useGSAP(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    } else {
      let tl = gsap.timeline();
      tl.to(blink.current, {
        // backgroundColor: "rgba(255,0,0,0.7)",
        opacity: 1,
        duration: 0.3,
      });
      tl.to(blink.current, {
        duration: 1,
        opacity: 1,
      });
      tl.to(".blink", {
        // backgroundColor: "rgba(255,0,0,0)",
        duration: 0.3,
        opacity: 0,
      });
    }
  }, [error]);

  async function handleSubmit(e) {
    e.preventDefault();
    setsubmitted(true);
    let email = mail.current.value;
    let password = pass.current.value;
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setResponsed(response);
      if (response.data.status == "success") {
        navigate("/");
      } else {
        seterror((e) => !e);
        setsubmitted(false);
      }
    } catch (err) {
      setsubmitted(false);
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-center px-14 relative h-screen justify-center md:gap-6 gap-2 p-4 bg-[#2B2738] text-white">
        <div
          ref={blink}
          className="h-screen w-screen capitalize backdrop-blur-xl blink opacity-0 text-center text-white md:text-4xl lg:text-5xl text-2xl pointer-events-none fixed z-30 flex items-center justify-center font-[panchang] font-semibold"
        >
          {responsed?.data?.message}
        </div>
        <div className="md:w-[55%] relative h-full bg-no-repeat overflow-hidden   left  rounded-3xl p-8">
          <img
            className="h-full w-full absolute top-0 left-0 brightness-[40%] object-cover"
            src="https://turnedninja.com/cdn/shop/files/5_8e47c863-fe27-4c86-88e8-c03b2e589206_1024x1024.jpg?v=1685689430"
            alt=""
          />
          <div className=" z-10 relative h-full w-full flex flex-col  justify-between ">
            <div className="top flex  justify-between   items-center">
              <Logo invert={true} />
              <Link
                to="/"
                className="p-2 bg-white/20 rounded-full px-4 md:px-6 text-sm flex items-center gap-1"
              >
                <i className="ri-arrow-left-line text-xl"></i> Back to website
              </Link>
            </div>
            <div className="bottom  justify-between flex flex-col items-center">
              <p className="font-bold text-[8vw] leading-none md:text-4xl font-[panchang] uppercase text-center">
                Wear Treadings
              </p>
              <p className="font-light font-[panchang] text-xl">Be Unique</p>
            </div>
          </div>
        </div>
        <div className="md:w-[45%] h-full right  md:p-14">
          <div>
            <h2 className="text-4xl font-semibold font-[panchang]">
              Welcome Back!
            </h2>
            <p className="text-sm mt-4">
              Don't have an account?{" "}
              <Link className="text-blue-700 underline" to="/signup">
                SignUp
              </Link>
            </p>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4 mt-8"
            >
              <div>
                <input
                  required={true}
                  ref={mail}
                  className="w-full focus:outline-none p-3 placeholder:text-gray-500 bg-[#3B364C] rounded-lg"
                  type="email"
                  placeholder="snowjon@gmail.com"
                />
              </div>
              <div>
                <input
                  required={true}
                  ref={pass}
                  className="w-full focus:outline-none p-3 placeholder:text-gray-500 bg-[#3B364C] rounded-lg"
                  type="password"
                  placeholder="Enter your passoword"
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-[#6E54B5] rounded-lg relative flex items-center justify-center"
              >
                {submitted ? (
                  <>
                    <div className="loader h-8 w-8 animate-spin absolute  rounded-full border-4 border-t-white border-b-white border-r-transparent border-l-transparent"></div>
                    <p className="opacity-0">Create account</p>
                  </>
                ) : (
                  <>
                    <div className="loader opacity-0 h-10 w-10 animate-spin absolute  rounded-full border-4 border-t-black border-b-black border-r-transparent border-l-transparent"></div>
                    <p>Login </p>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
