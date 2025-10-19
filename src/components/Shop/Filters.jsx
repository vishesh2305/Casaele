import React from "react";

function Filters({
  categoryData,
  selectedCategory,
  setSelectedCategory,
  setFilteredItems, // Note: setFilteredItems is not used here but kept for stability
  setCurrentPage,
  maxPrice,
  setMaxPrice,
  actualMaxPrice, // New prop for the slider's max value
  allItems,
}) {
  return (
    <aside className="w-full p-4 sm:p-6 bg-white border rounded-2xl shadow-md">
      <div className="mb-6 sm:text-left flex justify-between">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Filters
        </h2>
        <img src="/Shop/Filter.svg" alt="frame icon" className="" />
        
      </div>
      <hr className="border-gray-300 mb-4" />

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <ul className="space-y-2">
            {Object.entries(categoryData || {}).map(([category, count]) => (
              <li
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`flex justify-between items-center cursor-pointer px-3 py-2 rounded-md transition-all duration-200 ${
                  selectedCategory === category
                    ? "text-red-600 font-semibold bg-red-50"
                    : "text-gray-700 hover:text-red-500 hover:bg-gray-100"
                }`}
              >
                <span>{category}</span>
                <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Levels */}
        <div>
          <h3 className="text-2xl sm:text-xl font-semibold text-gray-900 mb-4">Level</h3>
          <hr className="border-gray-300 mb-8" />
          <div className="grid grid-cols-[auto_auto] gap-6 justify-start mx-6 mb-10">
            {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
              <button key={level} className="flex justify-start">
                <img
                  src={`Shop/${level}.svg`}
                  alt={level}
                  className="h-8 w-auto object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <h3 className="text-2xl sm:text-xl font-semibold text-gray-900 mb-2">Price</h3>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>₹0</span>
            <span className="font-semibold text-gray-900">₹{maxPrice}</span>
            <span>₹{actualMaxPrice}</span>
          </div>
          <input
            type="range"
            className="w-full accent-[rgba(173,21,24,1)]"
            min="0"
            max={actualMaxPrice}
            step="10" // You can adjust the step value as needed
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <hr className="border-gray-300" />

        {/* The "Apply Filter" button is no longer needed since the filter applies automatically */}
      </div>
    </aside>
  );
}

export default Filters;