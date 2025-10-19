import React from "react";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import Pagination from "./Pagination";

function ProductGrid({
  currentItems,
  selectedCategory,
  indexOfFirstItem,
  indexOfLastItem,
  selectedItems,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 flex flex-col min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 mt-2 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold text-black">
          {selectedCategory || "All Products"}
        </h2>
        <p className="text-sm text-gray-500">
          Showing {indexOfFirstItem + 1}–
          {Math.min(indexOfLastItem, selectedItems.length)} of{" "}
          {selectedItems.length} items
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow lg:min-h-[760px]">
        {currentItems.map((item) => {
          // Determine if the item is a course (has 'thumbnail') or a product
          const isCourse = !!item.thumbnail;

          // Set the correct properties based on the item type
          const image = isCourse ? item.thumbnail : (item.images && item.images.length > 0 ? item.images[0] : '');
          const title = isCourse ? item.title : item.name;
          const linkTo = `/course-detail/${item._id}`;

          return (
            <Link
              to={linkTo}
              state={{ item: item }}
              key={item._id}
              className="w-full"
            >
              <Card
                image={image}
                title={title}
                description={item.description}
                price={item.price}
                discountPrice={item.discountPrice}
              />
            </Link>
          );
        })}
      </div>

      {/* Divider + Pagination */}
      <div className="mt-auto">
        <hr className="border border-gray-300 my-8" />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
}

export default ProductGrid;