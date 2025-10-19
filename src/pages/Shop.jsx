import React, { useState, useEffect } from "react";
import { apiGet } from "../utils/api";
import Banner from "../components/Shop/Banner";
import Filters from "../components/Shop/Filters";
import ProductGrid from "../components/Shop/ProductGrid";

function Shop() {
  const [products, setProducts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [actualMaxPrice, setActualMaxPrice] = useState(1000);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiGet('/api/products'),
      apiGet('/api/courses'),
      apiGet('/api/categories')
    ]).then(([productsData, coursesData, categoriesData]) => {
      const allProducts = Array.isArray(productsData) ? productsData : [];
      const allCourses = Array.isArray(coursesData.courses) ? coursesData.courses : [];
      
      setProducts(allProducts);
      setCourses(allCourses);
      
      const combinedItems = [...allProducts, ...allCourses];
      setFilteredItems(combinedItems);

      const highestPrice = combinedItems.reduce((max, item) => Math.max(max, item.price || 0), 0);
      const finalMaxPrice = highestPrice > 0 ? Math.ceil(highestPrice / 100) * 100 : 1000;
      setActualMaxPrice(finalMaxPrice);
      setMaxPrice(finalMaxPrice);

      if (categoriesData && Array.isArray(categoriesData.categories)) {
        const categoryMap = { 
          'All Products': combinedItems.length,
          'Courses': allCourses.length 
        };
        // Count items for both products and courses in each category
        categoriesData.categories.forEach(cat => {
          const product_count = allProducts.filter(p => p.category === cat.name).length;
          const course_count = allCourses.filter(c => c.category === cat.name).length;
          categoryMap[cat.name] = product_count + course_count;
        });
        setCategories(categoryMap);
      }
    })
    .catch(() => {
      setProducts([]);
      setCourses([]);
      setCategories({ 'All Products': 0, 'Courses': 0 });
    })
    .finally(() => setLoading(false));
  }, []);

  // **THE FIX IS HERE**
  // This useEffect now correctly filters both products and courses for any given category.
  useEffect(() => {
    let itemsToFilter = [];
    if (selectedCategory === 'All Products') {
      itemsToFilter = [...products, ...courses];
    } else if (selectedCategory === 'Courses') {
      itemsToFilter = [...courses];
    } else {
      // Filter both products and courses by the selected category
      const filteredProducts = products.filter(p => p.category === selectedCategory);
      const filteredCourses = courses.filter(c => c.category === selectedCategory);
      itemsToFilter = [...filteredProducts, ...filteredCourses];
    }
    
    // Apply the price filter to the result
    const priceFiltered = itemsToFilter.filter(item => (item.price || 0) <= maxPrice);
    setFilteredItems(priceFiltered);
    setCurrentPage(1);
  }, [selectedCategory, maxPrice, products, courses]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setItemsPerPage(4);
      else if (window.innerWidth < 1024) setItemsPerPage(6);
      else setItemsPerPage(9);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const allItems = [...products, ...courses];

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
      <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-20 mt-10">
        <div className="w-full lg:w-1/4 lg:sticky lg:top-24 h-fit">
          <Filters
            categoryData={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            actualMaxPrice={actualMaxPrice}
            allItems={allItems}
          />
        </div>
        <div className="w-full lg:w-3/4">
          <ProductGrid
            currentItems={currentItems}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            selectedItems={filteredItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </>
  );
}

export default Shop;