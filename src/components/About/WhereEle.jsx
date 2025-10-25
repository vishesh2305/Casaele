// src/components/About/WhereEle.jsx

import React from 'react'
import CmsContent from "../CmsContent"; // Import CmsContent

const WhereEle = () => {
  return (
    <>
      {/* Where is Ele Now Section */}
      <section className="py-12 sm:py-16 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12">
          Where is Ele Now?
        </h2>
        {/* Use CmsContent for the map image */}
        <CmsContent
          slug="about-where-ele-map-image" // New unique slug
          showImage={true}
          imageClassName="shadow-md w-full h-auto object-cover"
          fallbackImage="/About/image 54.svg" // Keep the original as a fallback
          className="relative w-full max-w-7xl mx-auto" // Added classes to mimic original wrapper
        >
          {/* Default/Fallback content (if none provided in CMS) */}
          <img
            src="/About/image 54.svg"
            alt="World Map"
            className="shadow-md w-full h-auto object-cover"
          />
        </CmsContent>
        <div className="relative w-full">
          {/* Placeholder for marker/tooltip (keep as is or remove if functionality is gone) */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-md hidden sm:block"></div>
        </div>
      </section>
    </>
  )
}

export default WhereEle