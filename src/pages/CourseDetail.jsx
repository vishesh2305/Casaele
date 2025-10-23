import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ProductImage from '../components/CourseDetail/ProductImage';
import ProductInfo from '../components/CourseDetail/ProductInfo';
import DetailedInfo from '../components/CourseDetail/DetailedInfo';
// KeyFeatures component is now removed
import Reviews from '../components/CourseDetail/Reviews';
import LikeSection from '../components/CourseDetail/LikeSection';
import { apiGet } from '../utils/api';
import Spinner from '../components/Common/Spinner';
import { useCart } from '../context/CartContext'; // We need this for ProductInfo

function CourseDetail() {
  const { id: courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null); // Start as null
  const [loading, setLoading] = useState(true);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  
  // State for Cart/ProductInfo
  const { addToCart, isItemAdded } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // This effect runs when the page loads or courseId changes
    setLoading(true);
    setCourse(null); // Clear old course data
    
    // 1. Fetch the main course using the correct endpoint
    const fetchCourse = apiGet(`/api/courses/${courseId}`);
    
    // 2. Fetch all courses for the "LikeSection"
    const fetchAllCourses = apiGet('/api/courses');

    Promise.all([fetchCourse, fetchAllCourses])
      .then(([courseData, allCourses]) => {
        setCourse(courseData); // This object has the 'images' array
        
        // Filter out the current course for the "like" list
        if (Array.isArray(allCourses)) {
          const filtered = allCourses
            .filter(c => c._id !== courseData._id)
            .slice(0, 4);
          setRecommendedCourses(filtered);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch course data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
      
  }, [courseId]); // Rerun when courseId in the URL changes

  useEffect(() => {
    // This effect runs when the course data is successfully loaded
    if (course) {
      setAdded(isItemAdded(course._id));
    }
    setQuantity(1);
  }, [course, isItemAdded]);

  // Handler for the "Add to Cart" button
  const handleAddToCart = (itemWithOptions) => {
    addToCart({ ...itemWithOptions, quantity });
    setAdded(true);
  };

  // Handler for the "You might also like" cards
  const handleLikeCardClick = (card) => {
    navigate(`/course-detail/${card._id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center p-20 font-semibold">Course not found.</div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-10">
      <div className="w-full max-w-7xl mx-auto pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* *** THIS IS THE FIX ***
            We pass the entire 'course' object to the 'item' prop.
            ProductImage.jsx will handle the 'course.images' array.
          */}
          <ProductImage item={course} />

          <ProductInfo
            item={course}
            quantity={quantity}
            setQuantity={setQuantity}
            added={added}
            handleAddToCart={handleAddToCart}
          />
        </div>

        <div className="mt-20">
          <DetailedInfo
            description={course.description}
            instructor={course.instructor}
          />
          {/* KeyFeatures component is removed */}
          <Reviews courseId={course._id} />
          <LikeSection
            likecards={recommendedCourses}
            handleLikeCardClick={handleLikeCardClick}
          />
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;