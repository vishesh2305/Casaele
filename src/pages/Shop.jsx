import React, { useRef, useState, useEffect } from "react";
import { apiGet } from "../utils/api";
import Banner from "../components/Shop/Banner";
import Filters from "../components/Shop/Filters";
import ProductGrid from "../components/Shop/ProductGrid";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);


    useEffect(() => {
    setLoading(true);
    apiGet('/api/products')
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredItems(data);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  
// Responsive items per page logic
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


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);



  if (loading) {
    return (
      <>
        <Banner />
        <div className="text-center p-20 font-semibold">Loading Products...</div>
      </>
    );
  }


  return (
    <>
      <Banner />

      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-20 mt-5">
        <div className="w-full lg:w-1/4 lg:sticky lg:top-24">
          <Filters
            setFilteredItems={setFilteredItems}
            setCurrentPage={setCurrentPage}
            allItems={products}
          />
        </div>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4">
          <ProductGrid
            currentItems={currentItems}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            selectedItems={filteredItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  );
}

export default Shop;
