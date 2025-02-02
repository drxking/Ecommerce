import React from "react";
import gsap from "gsap";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

const ErrorLogger = (err) => {
  let whole = useRef();
  useGSAP(() => {
    gsap.to(whole.current, {
      duration: 0.5,
      y: 0,
      filter: "blur(0px)",
      ease: "power2.out"
    });
    gsap.to(whole.current, {
      duration: 0.5,
      y: -100,
      delay: 4,
      filter: "blur(8px)",
      ease: "power2.in",
    });
    console.log(err);
  }, [err]);

  return (
    <div
      ref={whole}
      className="h-full translate-y-[-100px]  blur w-full flex absolute z-10  pointer-events-none"
    >
      <div className=" absolute z-10 top-4 px-3 py-2 rounded-xl bg-red-500 right-4 text-white">
        <p className="text-sm">{err.err}</p>
      </div>
    </div>
  );
};

export default ErrorLogger;
