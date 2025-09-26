import React, { useRef, useState, useEffect } from "react";
import courses from '../components/Shop/courses';
import ebooks from "../components/Shop/Ebooks";
import Freebies from "../components/Shop/Freebies";
import games from "../components/Shop/games";
import pdf from "../components/Shop/pdf";
import subscription from "../components/Shop/Subscription";

import Banner from "../components/Shop/Banner";
import Filters from "../components/Shop/Filters";
import ProductGrid from "../components/Shop/ProductGrid";

function Shop() {
  const courseref = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("Courses");
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPrice, setMaxPrice] = useState(200);
  const [filteredItems, setFilteredItems] = useState([]);

  // ✅ Responsive items per page
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setItemsPerPage(1); // Mobile → 1 card per page
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2); // Tablet → 2 cards per page
      } else {
        setItemsPerPage(6); // Laptop → 6 cards per page
      }
    }

    handleResize(); // initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categoryData = {
    Courses: courses,
    "E-books": ebooks,
    "Games & Flashcards": games,
    "Worksheets (PDFs)": pdf,
    Subscriptions: subscription,
    Freebies: Freebies,
  };

  const allItems = categoryData[selectedCategory] || [];

  // ✅ load initial category items
  useEffect(() => {
    setFilteredItems(allItems);
    setCurrentPage(1);
  }, [selectedCategory, allItems]);

  const selectedItems = filteredItems;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(selectedItems.length / itemsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

  return (
    <>
      <Banner />

      {/* Filters + Products */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-20 mt-5">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4 lg:sticky lg:top-24">
          <Filters
            categoryData={categoryData}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setFilteredItems={setFilteredItems}
            setCurrentPage={setCurrentPage}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            allItems={allItems}
          />
        </div>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4">
          <ProductGrid
            currentItems={currentItems}
            selectedCategory={selectedCategory}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            selectedItems={selectedItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
          />
        </div>
      </div>
    </>
  );
}

export default Shop;
