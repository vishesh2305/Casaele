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
        {data.map((material, index) => (
          <Link
            to={`/material-detail/${material.id}`}
            state={material}
            key={index}
            className="
              snap-start flex-shrink-0
              w-[200px]       /* Mobile smaller width */
              sm:w-[220px]    /* Tablet width */
              md:w-[250px]    /* Small desktop */
              lg:w-[300px]    /* Large desktop */
            "
          >
            <Card
              image={material.image}
              title={material.title}
              description={material.description}
              tags={material.tags}
            />
          </Link>
        ))}
      </div>
    </div>
  );
});

export default CardSlider;