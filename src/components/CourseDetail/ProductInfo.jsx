import React, { useEffect, useState } from "react";
import QuantitySelector from "./QuantitySelector";

function ProductInfo({ item, quantity, setQuantity, added, handleAddToCart }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  
  const hasDiscount = item?.discountPrice > 0;
  const discountPercentage = hasDiscount ? Math.round(((item.price - item.discountPrice) / item.price) * 100) : 0;


  useEffect(() => {
    setSelectedLevel(null);
    setSelectedFormat(item?.productType === 'Both' ? null : item?.productType);
  }, [item.id, item?.productType]);

  const handleAdd = () => {
    if ((item?.productType === 'Digital' || item?.productType === 'Physical' || item?.productType === 'Both') && !selectedFormat) {
      alert("Please select a format before adding to cart.");
      return;
    }
    if (!selectedLevel) {
      alert("Please select a Level before adding to cart.");
      return;
    }
    handleAddToCart({
      ...item,
      selectedLevel,
      selectedFormat,
    });
  };

  return (
    <div className="w-full flex flex-col space-y-5">
      <h1 className="font-bold text-4xl lg:text-5xl">{item?.title}</h1>

      {/* Pricing */}
      <div className="flex items-center space-x-3 pt-2">
        {hasDiscount ? (
          <>
            <span className="font-bold text-4xl lg:text-5xl text-black">₹{item.discountPrice}</span>
            <span className="text-2xl text-gray-400 line-through">₹{item.price}</span>
            <span className="bg-[#FDF2F2] text-red-600 text-sm font-semibold px-3 py-1 rounded-full">-{discountPercentage}%</span>
          </>
        ) : (
          <span className="font-bold text-4xl lg:text-5xl text-black">₹{item?.price}</span>
        )}
      </div>

      {/* Levels with Images */}
      <div className="pt-2">
        <h3 className="font-medium text-gray-500 text-base mb-2">Levels</h3>
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`p-1 rounded-lg border-2 transition-colors duration-200 focus:outline-none ${
                selectedLevel === level
                  ? "bg-[#FDF2F2] border-[#FDF2F2]"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={`/Shop/${level}.svg`}
                alt={`Level ${level}`}
                className="w-10 h-10 object-contain"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Format Options */}
      {(item?.productType === 'Digital' || item?.productType === 'Physical' || item?.productType === 'Both') && (
        <div className="flex items-center p-1 rounded-full w-full max-w-xs">
          {(item.productType === 'Digital' || item.productType === 'Both') && (
            <button
              onClick={() => setSelectedFormat("Digital")}
              className={`flex-1 py-2 rounded-full text-base font-normal transition-colors ${
                selectedFormat === "Digital"
                  ? "bg-[#FDF2F2] text-pink-800 shadow"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Digital
            </button>
          )}
          {(item.productType === 'Physical' || item.productType === 'Both') && (
            <button
              onClick={() => setSelectedFormat("Physical")}
              className={`flex-1 py-2 rounded-full text-base font-normal transition-colors ${
                selectedFormat === "Physical"
                  ? "bg-[#FDF2F2] text-pink-800 shadow"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Physical
            </button>
          )}
        </div>
      )}
      
      {/* Quantity Selector + Cart */}
      <div className="pt-4">
        <QuantitySelector
          quantity={quantity}
          increaseQty={() => setQuantity((q) => q + 1)}
          decreaseQty={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
          added={added}
          handleAddToCart={handleAdd}
        />
      </div>
    </div>
  );
}

export default ProductInfo;