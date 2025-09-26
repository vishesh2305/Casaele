import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import likecards from '../components/CourseDetail/likecards.js';
import reviews from '../components/CourseDetail/ReviewsData.js';
import ProductImage from '../components/CourseDetail/ProductImage.jsx';
import ProductInfo from '../components/CourseDetail/ProductInfo.jsx';
import DetailedInfo from '../components/CourseDetail/DetailedInfo.jsx';
import KeyFeatures from '../components/CourseDetail/KeyFeatures.jsx';
import LikeSection from '../components/CourseDetail/LikeSection.jsx';
import Reviews from '../components/CourseDetail/Reviews.jsx';

function CourseDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [item, setItem] = useState(location.state || likecards[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // ✅ FIXED: This function now accepts the product data with selections
  const handleAddToCart = (productDataWithSelections) => {
    // It updates the main 'item' state with the selections
    setItem(productDataWithSelections);
    setAdded(true);
  };

  const goToCheckout = () => {
    // Now, when we navigate, the 'item' object correctly contains the selected level and format
    navigate('/cart-checkout', { state: { item, quantity } });
  };

  const handleLikeCardClick = (card) => {
    setItem(card);
    setQuantity(1);
    setAdded(false);
    window.scrollTo(0, 0);
  };

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
              goToCheckout={goToCheckout}
            />
          </div>
        </section>

        {/* Other sections remain the same... */}
        <section className="py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            <div className="lg:col-span-2">
              <DetailedInfo />
            </div>
            <div className="lg:col-span-1">
              <KeyFeatures />
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <LikeSection
            likecards={likecards}
            handleLikeCardClick={handleLikeCardClick}
          />
        </section>

        <section className="py-8 sm:py-12">
          <Reviews reviews={reviews} />
        </section>
      </div>
    </div>
  );
}

export default CourseDetail;