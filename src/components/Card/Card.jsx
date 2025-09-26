import React from 'react';

export default function Card({ image, title, description, tags, price, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md w-full overflow-hidden"
    >
      <img
        src={image}
        alt={title}
        // className="w-full h-48 object-cover rounded-t-lg"
        className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover rounded-t-lg"

      />

      <div className="p-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>

        {/* Tags */}
        {tags && Array.isArray(tags) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-pink-100 rounded-full px-3 py-1 text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {typeof price === 'number' && (
          <div>
            <span className="text-md font-semibold text-gray-800">${price}</span>
          </div>
        )}
      </div>
    </div>
  );
}