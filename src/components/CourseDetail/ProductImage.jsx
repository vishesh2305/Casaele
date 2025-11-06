// src/components/CourseDetail/ProductImage.jsx

import React, { useState, useEffect } from 'react';
import { FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductImage = ({ item }) => {
  // State to track which image index is currently selected
  const [currentIndex, setCurrentIndex] = useState(0);

  const getImages = (product) => {
    // 1. Check for Course model 'images' array
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    // 2. Check for Product model 'imageUrls' array
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls;
    }
    // 3. Fallback for Course model 'thumbnail'
    if (product.thumbnail) {
      return [product.thumbnail]; // Put single thumbnail in an array
    }
    // 4. Legacy fallback
    if (product.imageUrl) {
      return [product.imageUrl]; // Put old single image in an array
    }
    return []; // No images
  };

  const images = getImages(item);

  // When the item (product) changes, reset the index to 0
  useEffect(() => {
    setCurrentIndex(0);
  }, [item]);

  // --- Carousel Navigation ---
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // --- Render Logic ---

  if (images.length === 0) {
    // Placeholder if no images are available
    return (
      <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <FiImage className="w-24 h-24 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-square rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
      {/* Main Image */}
      <img
        src={images[currentIndex]}
        alt={item.name || 'Product Image'}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Navigation Buttons (Only show if more than 1 image) */}
      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-900 rounded-full p-2 shadow-md transition-all z-10"
            aria-label="Previous Image"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-900 rounded-full p-2 shadow-md transition-all z-10"
            aria-label="Next Image"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, slideIndex) => (
              <div
                key={slideIndex}
                onClick={() => setCurrentIndex(slideIndex)}
                className={`
                  w-2.5 h-2.5 rounded-full cursor-pointer transition-all
                  ${currentIndex === slideIndex ? 'bg-white scale-110' : 'bg-white/50'}
                `}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductImage;