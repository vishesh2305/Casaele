import React, { useState, useEffect } from 'react';
import Banner from '../components/Shop/Banner';
import Filters from '../components/Shop/Filters';
import ProductGrid from '../components/Shop/ProductGrid';
import Pagination from '../components/Shop/Pagination';
import { apiGet } from '../utils/api';
import Spinner from '../components/Common/Spinner';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentCoursePage, setCurrentCoursePage] = useState(1);
  const [totalCoursePages, setTotalCoursePages] = useState(1);

  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, sortOrder, currentCoursePage]);

  const fetchCategories = async () => {
    try {
      const data = await apiGet('/api/categories');
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const params = new URLSearchParams({
        page: currentCoursePage,
        limit: ITEMS_PER_PAGE,
        ...(selectedCategory && { category: selectedCategory }),
        ...(sortOrder && { sort: sortOrder }),
      });
      const data = await apiGet(`/api/courses?${params}`);
      setCourses(data.courses || []);
      setTotalCoursePages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
      setTotalCoursePages(1);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentCoursePage(1);
  };

  const handleSortChange = (sortValue) => {
    setSortOrder(sortValue);
    setCurrentCoursePage(1);
  };

  const handleCoursePageChange = (page) => {
    setCurrentCoursePage(page);
    window.scrollTo(0, 0);
  };

  if (loadingCourses) {
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

        {/* Courses Grid Section - Right Side */}
        <div className="w-full lg:w-3/4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Courses</h2>

          {loadingCourses ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : (
            <ProductGrid
              products={courses}
              itemType="course"
            />
          )}

          {!loadingCourses && totalCoursePages > 1 && (
            <div className="mt-10 sm:mt-12">
              <Pagination
                currentPage={currentCoursePage}
                totalPages={totalCoursePages}
                onPageChange={handleCoursePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;
