import React from 'react'

const WhereEle = () => {
  return (
    <>
      {/* Where is Ele Now Section */}
      <section className="py-12 sm:py-16 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12">
          Where is Ele Now?
        </h2>
        <div className="relative w-full">
          <img
            src="About/image 54.svg"
            alt="World Map"
            className="shadow-md w-full h-auto object-cover"
          />
          {/* Placeholder for marker/tooltip */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-md hidden sm:block"></div>
        </div>
      </section>
    </>
  )
}

export default WhereEle
