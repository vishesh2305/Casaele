import React from "react";

function ProductImage({ item }) {
  return (
    <div className="w-full">
      <img
        src={item?.image}
        alt={item?.title}
        className="w-full h-auto object-cover rounded-2xl aspect-[6/5]"
      />
    </div>
  );
}

export default ProductImage;