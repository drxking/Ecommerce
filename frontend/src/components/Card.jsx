import React from "react";
import { Link } from "react-router-dom";

const Card = ({ name, price, imageLink, _id ,views}) => {
  return (
    <div>
      <Link to={`/products/${_id}`}>
        <img
          src={imageLink}
          className="sm:h-72 sm:w-56 w-full rounded-3xl object-cover"
          alt={name}
        />
        <h2 className="sm:text-xl text-2xl font-bold mt-2">{name}</h2>
        <p className="capitalize sm:text-sm text-base text-gray-600 font-medium">
          Classic Tshirt for daily use
        </p>
        <p className="sm:font-medium font-semibold text-xl sm:text-lg">${price}</p>
        {views?(
          <p className="sm:font-medium font-semibold text-xs">{views} views</p>
        ):""}
      </Link>
    </div>
  );
};

export default Card;
