import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ProductImage from "../components/CourseDetail/ProductImage";
import ProductInfo from "../components/CourseDetail/ProductInfo";
import DetailedInfo from "../components/CourseDetail/DetailedInfo";
import Reviews from "../components/CourseDetail/Reviews";
import LikeSection from "../components/CourseDetail/LikeSection";
import { apiGet } from "../utils/api";
import Spinner from "../components/Common/Spinner";
import { useCart } from "../context/CartContext";
// *** 1. REMOVE the static import ***
// import likecards from "../components/CourseDetail/likecards"; 

function CourseDetail() {
  const { id: courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(location.state?.course || null);
  const [loading, setLoading] = useState(!location.state?.course);
  
  // *** 2. ADD new state for recommended courses ***
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  const { addToCart, isItemAdded } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // This effect runs when the page loads or courseId changes
    setLoading(true);
    setCourse(null); // Clear old course data
    
    // --- 3. FETCH the main course ---
    const fetchCourse = apiGet(`/api/courses/${courseId}`);
    
    // --- 4. FETCH all other courses for the "LikeSection" ---
    const fetchAllCourses = apiGet('/api/courses');

    Promise.all([fetchCourse, fetchAllCourses])
      .then(([courseData, allCourses]) => {
        setCourse(courseData);
        
        // --- 5. FILTER the "like" cards ---
        if (Array.isArray(allCourses)) {
          // Remove the current course from the "like" list and take the first 4
          const filtered = allCourses
            .filter(c => c._id !== courseData._id) // Don't recommend itself
            .slice(0, 4); // Show a max of 4
          setRecommendedCourses(filtered);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch course data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
      
  }, [courseId]); // Rerun when courseId changes

  useEffect(() => {
    if (course) {
      setAdded(isItemAdded(course._id));
    }
    setQuantity(1);
  }, [course, isItemAdded]);

  const handleAddToCart = (itemWithOptions) => {
    addToCart({ ...itemWithOptions, quantity });
    setAdded(true);
  };

  const handleLikeCardClick = (card) => {
    // *** 6. UPDATE the click handler to use _id ***
    // The data is now from the database, so it uses '_id'
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
          <ProductImage
            image={course.imageUrl}
            title={course.title}
          />
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
          <Reviews courseId={course._id} />

          {/* --- 7. PASS the new dynamic data to the component --- */}
          <LikeSection
            likecards={recommendedCourses} // Use dynamic data
            handleLikeCardClick={handleLikeCardClick}
          />
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;