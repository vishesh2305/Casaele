import React, { useState, useEffect } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { apiGet } from "../../utils/api";

function Testimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const CHARACTER_LIMIT = 180;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(true)
    apiGet('/api/testimonials/approved')
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - itemsPerPage;
      const lastPossibleIndex = Math.floor(((items?.length || 0) - 1) / itemsPerPage) * itemsPerPage;
      return newIndex < 0 ? lastPossibleIndex : newIndex;
    });
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + itemsPerPage;
      return newIndex >= (items?.length || 0) ? 0 : newIndex;
    });
  };

  const visibleTestimonials = (items || []).slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="text-center font-bold text-black text-2xl sm:text-3xl md:text-4xl mb-10 md:mb-12">
        Testimonials
      </h1>

      {/* Main container is now relative for button positioning */}
      <div className="relative">
        <button
          onClick={handlePrev}
          // Buttons are positioned absolutely
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 bg-white border border-gray-300 rounded-full p-3 shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Previous Testimonial"
        >
          <GoArrowLeft className="text-gray-600 text-2xl" />
        </button>

        {/* This container adds padding on mobile to create space */}
        <div className="w-full flex justify-center gap-6 px-12 md:px-0">
          {loading ? (
            <div className="w-full text-center py-10 text-gray-500">Loading testimonials...</div>
          ) : visibleTestimonials.length === 0 ? (
            <div className="w-full text-center py-10 text-gray-400">No testimonials yet.</div>
          ) : visibleTestimonials.map((t, index) => (
            <div
              key={index}
              className="w-full sm:w-72 lg:w-64 h-96 flex-shrink-0 flex flex-col bg-white p-6 rounded-xl"
            >
              <img
                src="/Home/Frame.svg"
                alt="Quote"
                className="w-10 mx-auto mb-4 flex-shrink-0"
              />
              
              <p className="flex-grow text-sm mb-4 font-medium leading-snug overflow-hidden">
                {(t.message || '').length > CHARACTER_LIMIT
                  ? `${(t.message || '').substring(0, CHARACTER_LIMIT)}...`
                  : (t.message || '')}
              </p>
              
              <div className="flex items-center justify-center flex-shrink-0 border-t pt-4">
                <div className="text-center">
                  <p className="font-semibold">{t.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-400">{typeof t.rating === 'number' ? `${t.rating.toFixed(1)}/5` : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 bg-white border border-gray-300 rounded-full p-3 shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Next Testimonial"
        >
          <GoArrowRight className="text-gray-600 text-2xl" />
        </button>
      </div>
    </div>
  );
}

export default Testimonials;