import React, { useRef } from "react";
import { Link } from "react-router-dom";

const Card = ({ name, price, imageLink, _id, description, isAdmin, handleRemove }) => {
  let spinner = useRef(null);
  let i = useRef(null);
  return (
    <div className="relative group">
      {
        (isAdmin) ? (
          <button onClick={(e) => {
            handleRemove(e, _id)
            

          }} title="Remove from collection" className="absolute items-center md:group-hover:opacity-100 md:group-hover:pointer-events-auto  md:opacity-0 duration-200 md:pointer-events-none flex justify-center  right-4 top-2 bg-red-500 p-2 text-white rounded-lg text-md ">
            <i className="ri-delete-bin-line leading-none"></i>
            <div className="spinner h-4 w-4 absolute border-2 animate-spin hidden rounded-full border-t-white border-r-transparent border-l-transparent border-b-white"></div>
          </button>
        ) : ""
      }
      <Link to={`/products/${_id}`}>
        <img
          src={imageLink}
          className="sm:h-72 h-[120vw] sm:w-56 w-[100vw] object-cover"
          alt={name}
          loading="lazy"
        />
        <h2 className="text-lg font-medium mt-2 sm:w-56 sm:truncate sm:leading-normal leading-none">{name}</h2>
        <p className=" sm:text-xs text-base text-gray-500 font-medium tracking-wide">
          {description}
        </p>
        <p className="sm:font-medium font-semibold text-xl sm:text-lg">
          ${price}
        </p>
      </Link>
    </div>
  );
};

export default Card;
