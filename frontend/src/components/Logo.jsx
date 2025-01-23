import React from "react";

const Logo = ({ width, invert }) => {
  return (
    <img
      src="/tsabinz.png"
      className={`w-10 min-w-14 ${invert ? "invert" : ""}`}
    />
  );
};

export default Logo;
