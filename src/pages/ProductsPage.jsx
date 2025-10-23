import React, { useState, useEffect } from 'react';
import Banner from '../components/Shop/Banner';
import Filters from '../components/Shop/Filters';
import ProductGrid from '../components/Shop/ProductGrid';
import Spinner from '../components/Common/Spinner';
import { apiGet } from '../utils/api';
// import Pagination from '../components/Shop/Pagination'; // Uncomment if needed

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []); // Run once on mount

  const fetchCategories = async () => {
    try {
      const data = await apiGet('/api/categories');
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      // const params = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
      const data = await apiGet('/api/products');
      setProducts(data.products || data || []);
      // setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      // setTotalPages(1);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sortValue) => {
    setSortOrder(sortValue);
  };

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  //   window.scrollTo(0, 0);
  // };

  if (loadingProducts) {
    return (
      <>
        <Banner />
        <div className="text-center p-20 font-semibold">
          <Spinner />
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Banner />
      <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-20 mt-10">
        {/* Filters Section - Left Side */}
        <div className="w-full lg:w-1/4 lg:sticky lg:top-24 h-fit">
          <Filters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Products Grid Section - Right Side */}
        <div className="w-full lg:w-3/4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Products</h2>

          {loadingProducts ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : (
            <ProductGrid products={products} itemType="product" />
          )}

          {/* Pagination (uncomment if added later)
          {!loadingProducts && totalPages > 1 && (
            <div className="mt-10 sm:mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
