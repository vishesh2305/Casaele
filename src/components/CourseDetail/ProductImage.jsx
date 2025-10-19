import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

function ProductImage({ item }) {
  // This logic now handles all cases:
  // 1. A new course with an 'images' array.
  // 2. An old course with a 'thumbnail' string.
  // 3. A product with an 'images' array.
  // 4. A fallback placeholder if no image exists.
  const displayImages = item?.images?.length > 0 
    ? item.images 
    : (item?.thumbnail ? [item.thumbnail] : []);

  if (displayImages.length === 0) {
    displayImages.push("https://placehold.co/600x500/e5e7eb/4b5563?text=Image");
  }

  return (
    <div className="w-full">
      <Carousel
        showArrows={true}
        infiniteLoop={true}
        showThumbs={displayImages.length > 1} // Only show thumbs if there's more than one image
        thumbWidth={80}
        className="product-carousel"
      >
        {displayImages.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`${item?.title || item?.name} - Image ${index + 1}`}
              className="w-full h-auto object-cover rounded-2xl aspect-[6/5]"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ProductImage;