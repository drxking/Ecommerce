import React, { useState } from "react";
import { Link } from "react-router-dom";

const Card = ({
  name,
  price,
  comparedPrice,
  imageLink,
  _id,
  description,
  isAdmin,
  handleRemove,
  onAddToCart,
}) => {
  const [added, setAdded] = useState(false);

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({ _id, name, price, imageLink });
    } else {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingIdx = cart.findIndex((item) => item._id === _id);
        if (existingIdx > -1) {
          cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + 1;
        } else {
          cart.push({ _id, name, price, imageLink, quantity: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error(err);
      }
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const formattedPrice =
    price !== undefined && price !== null
      ? typeof price === "number"
        ? `₹ ${price.toLocaleString()}`
        : `₹ ${price}`
      : "";

  const formattedCompared =
    comparedPrice && Number(comparedPrice) > Number(price)
      ? `₹ ${Number(comparedPrice).toLocaleString()}`
      : null;

  return (
    <div className="group relative flex flex-col items-center bg-black text-white w-full rounded-none">
      {isAdmin && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemove(e, _id);
          }}
          title="Remove from collection"
          className="absolute z-20 top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 shadow-md flex items-center justify-center transition-all rounded-none"
          style={{ borderRadius: 0 }}
        >
          <i className="ri-delete-bin-line leading-none text-xs"></i>
        </button>
      )}

      {/* Product Image Frame */}
      <Link to={`/products/${_id}`} className="block w-full">
        <div
          className="w-full aspect-square overflow-hidden bg-neutral-950 border border-neutral-800 relative rounded-none flex items-center justify-center"
          style={{ borderRadius: 0 }}
        >
          {imageLink ? (
            <img
              src={imageLink}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-none brightness-95 group-hover:brightness-105"
              style={{ borderRadius: 0 }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500 font-light">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Centered Product Info Below Image */}
      <div className="w-full pt-4 pb-2 px-1 flex flex-col items-center text-center">
        {/* Product Title */}
        <Link to={`/products/${_id}`} className="block w-full">
          <h3 className="text-white font-[panchang] uppercase tracking-wider text-xs md:text-sm font-semibold hover:text-neutral-300 transition-colors line-clamp-2 leading-snug">
            {name}
          </h3>
        </Link>

        {/* Price display with optional crossed-out comparison price */}
        <div className="mt-1.5 flex items-center justify-center gap-2 text-xs md:text-sm font-medium tracking-wide">
          <span className="text-white">{formattedPrice}</span>
          {formattedCompared && (
            <span className="line-through text-neutral-500 text-xs font-normal">
              {formattedCompared}
            </span>
          )}
        </div>

        {/* Centered "Add To Cart" Button */}
        {!isAdmin && (
          <button
            type="button"
            onClick={handleAddToCartClick}
            className="mt-3.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-5 py-2 uppercase tracking-wider transition-colors shadow rounded-none"
            style={{ borderRadius: 0 }}
          >
            {added ? (
              <span className="flex items-center gap-1">
                <i className="ri-check-line"></i> Added
              </span>
            ) : (
              "Add To Cart"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
