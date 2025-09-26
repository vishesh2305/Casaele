import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

function QuantitySelector({ quantity, increaseQty, decreaseQty, added, handleAddToCart, goToCheckout }) {
  return (
    // Responsive gap: smaller on mobile, larger on desktop
    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full">
      {/* Quantity box */}
      {/* Responsive height: shorter on mobile, taller on desktop */}
      <div className="flex items-center justify-between border border-gray-300 bg-gray-200 px-4 h-12 md:h-14 rounded-full w-full md:w-auto">
        <button onClick={decreaseQty} className="text-gray-500 hover:text-black p-2"><FaMinus /></button>
        <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
        <button onClick={increaseQty} className="text-gray-500 hover:text-black p-2"><FaPlus /></button>
      </div>

      {/* Add to Cart button */}
      {/* Responsive height */}
      <button
        onClick={handleAddToCart}
        disabled={added}
        className={`bg-[rgba(173,21,24,1)] text-white font-semibold h-12 md:h-14 px-8 rounded-full transition-colors duration-300 w-full flex-1 whitespace-nowrap ${
            added
              ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
              : "hover:bg-[rgba(150,18,20,1)]"
          }`}
      >
        {added ? "Added!" : "Add to Cart"}
      </button>

      {/* Cart icon */}
      {added && (
        <img
          src="/Shop/cart.svg"
          alt="Cart"
          onClick={goToCheckout}
          className="w-8 md:w-10 h-8 md:h-10 cursor-pointer hover:scale-110 transition"
        />
      )}
    </div>
  );
}

export default QuantitySelector;