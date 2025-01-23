import React from "react";
import { Link } from "react-router-dom";

const Card = ({ name, price, imageLink, _id, description }) => {
  return (
    <div>
      <Link to={`/products/${_id}`}>
        <img
          src={imageLink}
          className="sm:h-72 h-[120vw] sm:w-56 w-[100vw] object-cover"
          alt={name}
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
