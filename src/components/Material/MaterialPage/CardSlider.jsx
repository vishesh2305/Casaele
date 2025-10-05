import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import Card from "../../Card/Card";

const CardSlider = forwardRef(({ data }, ref) => {
  return (
    <div className="relative px-2 sm:px-4 md:px-6 lg:px-16 mt-4 sm:mt-6 md:mt-8">
      <div
        ref={ref}
        className="
          flex space-x-4 
          overflow-x-auto 
          snap-x snap-mandatory
          scroll-smooth
          no-scrollbar
        "
      >
        {data.map((material) => (
          <Link
            to={`/material-detail/${material._id}`}
            state={{ material: material }} 
            key={material._id}
            className="snap-start flex-shrink-0 w-[200px] sm:w-[220px] md:w-[250px] lg:w-[300px]"
          >
            <Card {...material} />
          </Link>
        ))}
      </div>
    </div>
  );
});

export default CardSlider;