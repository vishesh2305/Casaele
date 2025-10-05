import React from "react";

function ProductImage({ item }) {

  const displayImage = item?.fileUrl || item?.image;


  return (
    <div className="w-full">
      <img
        src={displayImage || "https://placehold.co/600x500/e5e7eb/4b5563?text=Image"} 
        alt={item?.title || item?.name}
        className="w-full h-auto object-cover rounded-2xl aspect-[6/5]"
      />
    </div>
  );
}

export default ProductImage;