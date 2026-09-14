import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "../components/Logo";

const AdminLogin = () => {
  let navigate = useNavigate();
  let [submitted, setsubmitted] = useState(false);
  let [error, seterror] = useState(null);
  let [responsed, setResponsed] = useState(null);

  let mail = useRef(null);
  let pass = useRef(null);
  let blink = useRef(null);
  let isInitialRender = useRef(true);

  async function getToken() {
    let response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/utils/isadmin`,
      {
        withCredentials: true,
      }
    );
    if (response.data.isAdmin) {
      navigate("/admin");
    }
  }
  useEffect(() => {
    getToken();
  }, []);

  useGSAP(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    } else {
      let tl = gsap.timeline();
      tl.to(blink.current, {
        opacity: 1,
        duration: 0.3,
      });
      tl.to(blink.current, {
        duration: 1,
        opacity: 1,
      });
      tl.to(".blink", {
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
        `${import.meta.env.VITE_BASE_URL}/admin/login`,
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
        navigate("/admin");
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
      <div className="flex flex-col md:flex-row items-center md:px-14 px-6 relative min-h-screen justify-center md:gap-8 gap-4 p-4 bg-[#0a0a0a] text-white">
        <div
          ref={blink}
          className="h-screen w-screen backdrop-blur-xl blink opacity-0 text-center text-white md:text-4xl lg:text-5xl text-2xl pointer-events-none fixed z-30 flex items-center justify-center font-[panchang] font-semibold"
        >
          {responsed?.data?.message}
        </div>

        <div
          className="md:w-[55%] relative h-[450px] md:h-[600px] bg-no-repeat overflow-hidden text-white left border border-neutral-800 p-6 rounded-none shadow-2xl"
          style={{ borderRadius: 0 }}
        >
          <img
            className="h-full w-full absolute top-0 left-0 brightness-[35%] object-cover"
            src="https://turnedninja.com/cdn/shop/files/5_8e47c863-fe27-4c86-88e8-c03b2e589206_1024x1024.jpg?v=1685689430"
            alt=""
          />
          <div className="z-10 relative h-full w-full flex flex-col justify-between">
            <div className="top flex justify-between items-center">
              <Logo width={"16"} invert={true} />
              <Link
                to="/"
                className="p-2.5 bg-neutral-900/80 border border-neutral-700 hover:bg-white hover:text-black transition px-4 md:px-5 text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-none font-semibold"
                style={{ borderRadius: 0 }}
              >
                <i className="ri-arrow-left-line text-base"></i> Back to website
              </Link>
            </div>
            <div className="bottom justify-between flex flex-col items-center text-center">
              <p className="font-black text-2xl sm:text-3xl md:text-4xl font-[panchang] uppercase tracking-wider text-center text-white drop-shadow-md">
                Admin Portal
              </p>
              <p className="font-light font-[panchang] text-sm sm:text-base text-neutral-300 uppercase tracking-widest mt-1">
                Storefront Control Center
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-[45%] w-full right pt-2 md:p-10 flex flex-col justify-center max-w-md">
          <div className="bg-neutral-900/90 border border-neutral-800 p-8 shadow-2xl rounded-none" style={{ borderRadius: 0 }}>
            <h2 className="text-2xl sm:text-3xl font-black font-[panchang] uppercase tracking-wider text-white">
              Admin Login
            </h2>
            <p className="text-xs text-neutral-400 mt-2">
              Authorized personnel only. Access system configuration.
            </p>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4 mt-6"
            >
              <div>
                <label htmlFor="email" className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1 tracking-wider">
                  Admin Email
                </label>
                <input
                  required={true}
                  ref={mail}
                  className="w-full focus:outline-none p-3 placeholder:text-neutral-600 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-none focus:border-white transition"
                  type="email"
                  placeholder="admin@brand.com"
                  id="email"
                  style={{ borderRadius: 0 }}
                />
              </div>
              <div>
                <label htmlFor="pass" className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1 tracking-wider">
                  Password
                </label>
                <input
                  id="pass"
                  required={true}
                  ref={pass}
                  className="w-full focus:outline-none p-3 placeholder:text-neutral-600 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-none focus:border-white transition"
                  type="password"
                  placeholder="Enter admin password"
                  style={{ borderRadius: 0 }}
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full p-3.5 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-none hover:bg-neutral-200 transition relative flex items-center justify-center shadow mt-2 disabled:opacity-50"
                style={{ borderRadius: 0 }}
              >
                {submitted ? (
                  <>
                    <div className="loader h-5 w-5 animate-spin border-2 border-black border-t-transparent rounded-full"></div>
                    <span className="opacity-0">Authenticating...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
