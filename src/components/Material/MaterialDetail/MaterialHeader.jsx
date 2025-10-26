import React from "react";

function MaterialHeader({ material }) {
  // *** NEW LOGIC: ***
  // 1. Try to use the Banner Image (bannerImageUrl) first.
  // 2. If it's missing, fall back to the Card Image (fileUrl).
  // 3. If that's missing, use the old 'image' field (as a fallback).
  // 4. If all are missing, use the placeholder.
  const displayImage = 
    (material.bannerImageUrl && material.bannerImageUrl.trim() !== '') 
    ? material.bannerImageUrl 
    : (material.fileUrl && material.fileUrl.trim() !== '')
      ? material.fileUrl
      : (material.image && material.image.trim() !== '' ? material.image : "https://placehold.co/1200x800/e5e7eb/4b5563?text=Image");

  return (
    <div className="w-full pt-12 sm:pt-16">
      <div className="w-full mb-12 sm:mb-16">
        <img
          src={displayImage} // This now uses the new logic
          alt={material.title}
          className="w-full h-auto rounded-2xl object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {material.title}
          </h2>
          
          {/* Created On Date */}
          <p className="text-gray-500 text-sm">
            Created on:{" "}
            {material.createdAt
              ? new Date(material.createdAt).toLocaleDateString()
              : "N/A"}
          </p>

          {/* Updated On Date (This is already correct from our last change) */}
          {material.updatedAt && material.createdAt !== material.updatedAt && (
             <p className="text-gray-500 text-sm">
               Last updated:{" "}
               {new Date(material.updatedAt).toLocaleDateString()}
             </p>
          )}

          {/* Author */}
          {material.author && (
            <p className="text-gray-500 text-sm">
              Author: {material.author}
            </p>
          )}

          <p className="text-gray-800 text-lg font-semibold">
            {material.description}
          </p>

          {/* Multiple H5P/AI Embedded Content (No change) */}

        </div>

        <div className="w-full border-4 border-dashed border-red-300 p-6 rounded-2xl bg-white self-start">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Ideas y sugerencias para la clase
          </h3>
          <p className="text-gray-700 text-base leading-relaxed">
            Additional notes or suggestions related to this material can be
            displayed here. This section can also be powered by a field from
            your admin panel in the future.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MaterialHeader;