import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

function Reviews({ reviews }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLatestFirst, setIsLatestFirst] = useState(true);

  const sortedComments = [...reviews].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return isLatestFirst ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl sm:text-4xl font-bold">
          All Reviews <span className="text-gray-400 font-medium text-2xl">({reviews.length})</span>
        </h2>
        <button
          onClick={() => setIsLatestFirst((p) => !p)}
          className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <span>{isLatestFirst ? "Latest" : "Oldest"}</span>
          <FaAngleDown />
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
        {sortedComments.slice(0, visibleCount).map((review, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">{review.name}</h4>
              <div className="flex text-gray-300 text-xl">...</div>
            </div>
            <p className="text-gray-600 text-base">"{review.text}"</p>
            <p className="text-sm text-gray-400">Posted on {review.date}</p>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < reviews.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleCount((p) => p + 4)}
            className="border border-gray-300 rounded-full px-6 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
}

export default Reviews;