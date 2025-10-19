import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiGet } from '../utils/api';
import ProductImage from '../components/CourseDetail/ProductImage.jsx';
import ProductInfo from '../components/CourseDetail/ProductInfo.jsx';
import DetailedInfo from '../components/CourseDetail/DetailedInfo.jsx';
import KeyFeatures from '../components/CourseDetail/KeyFeatures.jsx';
import LikeSection from '../components/CourseDetail/LikeSection.jsx';
import Reviews from '../components/CourseDetail/Reviews.jsx';
import reviewsData from '../components/CourseDetail/ReviewsData.js';

function CourseDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const {id} = useParams();

  const [item, setItem] = useState(location.state?.item || null);
  const [loading, setLoading] = useState(!item); // Start loading if no item is passed
  const [relatedItems, setRelatedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);




  useEffect(() => {
    const fetchData = async () => {
      const isProduct = location.pathname.includes('course-detail');
      const apiUrl = isProduct ? `/api/products/${id}` : `/api/materials/${id}`;

      try {
        const fetchedItem = await apiGet(apiUrl);
        // Products use 'name', materials use 'title'. Let's standardize to 'title' for simplicity in ProductInfo.
        setItem({ ...fetchedItem, title: fetchedItem.name || fetchedItem.title });
      } catch (error) {
        console.error("Failed to fetch item:", error);
      } finally {
        setLoading(false);
      }
    };

        if (!item) {
      fetchData();
    }
  }, [id, item, location.pathname]);



  const handleAddToCart = (productDataWithSelections) => {
    navigate('/cart-checkout', { state: { item: productDataWithSelections, quantity } });
  };




  const handleLikeCardClick = (card) => {
    setItem(card);
    setQuantity(1);
    setAdded(false);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="text-center p-20">Loading...</div>;
  }

  if (!item) {
    return <div className="text-center p-20">Product not found.</div>;
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <ProductImage item={item} />
            <ProductInfo
              item={item}
              quantity={quantity}
              setQuantity={setQuantity}
              added={added}
              handleAddToCart={handleAddToCart}
            />
          </div>
        </section>

        {/* Other sections remain the same... */}
        <section className="py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            <div className="lg:col-span-2">
              <DetailedInfo item={item} />
            </div>
            <div className="lg:col-span-1">
              <KeyFeatures />
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <LikeSection
            likecards={relatedItems}
            handleLikeCardClick={handleLikeCardClick}
          />
        </section>

        <section className="py-8 sm:py-12">
          <Reviews reviews={reviewsData} />
        </section>
      </div>
    </div>
  );
}

export default CourseDetail;