import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ProductImage from '../components/CourseDetail/ProductImage'; // Reusing component
import ProductInfo from '../components/CourseDetail/ProductInfo';   // Reusing component
import DetailedInfo from '../components/CourseDetail/DetailedInfo'; // Reusing component
import Reviews from '../components/CourseDetail/Reviews';           // Reusing component (needs modification later for product reviews)
import LikeSection from '../components/CourseDetail/LikeSection';   // Reusing component (needs modification later for related products)
import { apiGet } from '../utils/api';
import Spinner from '../components/Common/Spinner';
import { useCart } from '../context/CartContext'; 

function ProductDetail() {
  const { id: productId } = useParams(); // Get ID from URL
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null); // State for product data
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]); // State for related products

  // Cart state
  const { addToCart, isItemAdded } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // Fetch data when productId changes
    setLoading(true);
    setProduct(null); // Clear old data

    // Fetch the specific product
    const fetchProduct = apiGet(`/api/products/${productId}`); 
    // Fetch other products for recommendations
    const fetchAllProducts = apiGet('/api/products'); 

    Promise.all([fetchProduct, fetchAllProducts])
      .then(([productData, allProducts]) => {
        // Standardize 'name' to 'title' if needed by ProductInfo
        setProduct({ ...productData, title: productData.name || productData.title }); 
        
        // Filter related products
        if (Array.isArray(allProducts)) {
          const filtered = allProducts
            .filter(p => p._id !== productData._id)
            .slice(0, 4); // Show max 4 recommendations
          setRecommendedProducts(filtered);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch product data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
      
  }, [productId]); // Rerun effect if productId changes

  useEffect(() => {
    // Update 'added' status when product data loads
    if (product) {
      setAdded(isItemAdded(product._id));
    }
    setQuantity(1); // Reset quantity
  }, [product, isItemAdded]);

  // Add to cart handler
  const handleAddToCart = (itemWithOptions) => {
    addToCart({ ...itemWithOptions, quantity });
    setAdded(true);
  };

  // Click handler for recommended products
  const handleLikeCardClick = (card) => {
    navigate(`/product-detail/${card._id}`); // Navigate to other product details
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><Spinner /></div>;
  }

  if (!product) {
    return <div className="text-center p-20 font-semibold">Product not found.</div>;
  }

  // Use the same structure as CourseDetail, passing the product data
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-10 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 bg-white rounded-2xl shadow-sm p-6 sm:p-8 md:p-10">
          {/* Reuse ProductImage */}
          <ProductImage item={product} /> 
          {/* Reuse ProductInfo */}
          <ProductInfo
            item={product}
            quantity={quantity}
            setQuantity={setQuantity}
            added={added}
            handleAddToCart={handleAddToCart}
          />
        </div>

        {/* Detailed info section */}
        <div className="mt-20 bg-white rounded-2xl shadow-sm p-6 sm:p-8 md:p-10">
          <DetailedInfo
            description={product.description}
            instructor={product.instructor} // Instructor might be undefined for products
          />
        </div>

        {/* Reviews section with better separation */}
        <div className="mt-20 bg-white rounded-2xl shadow-sm p-6 sm:p-8 md:p-10 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-3">
            Customer Reviews
          </h2>
          <Reviews courseId={product._id} /> {/* Temporarily using courseId prop */}
        </div>

        {/* Separator before "You might also like" */}
        <div className="my-16 border-t border-gray-200"></div>

        {/* Recommended products */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 md:p-10">
          <LikeSection
            likecards={recommendedProducts}
            handleLikeCardClick={handleLikeCardClick}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
