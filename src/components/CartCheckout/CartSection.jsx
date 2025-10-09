import React, { useState, useEffect } from "react";
import CouponSection from "./CouponSection";

function CartSection({ cartItem, onRemove, quantity, totalPrice, onTotalUpdate }) {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleCouponApplied = (coupon, discount) => {
    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
    const newTotal = totalPrice - discount;
    onTotalUpdate?.(newTotal);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    onTotalUpdate?.(totalPrice);
  };

  const finalTotal = totalPrice - discountAmount;

  // Update parent component when total changes
  useEffect(() => {
    onTotalUpdate?.(finalTotal);
  }, [finalTotal, onTotalUpdate]);
  // Note: The 'quantity' prop is available but not used in the target design.
  return (
    <>
      <h2 className="text-3xl font-semibold mb-6">
        Cart
      </h2>

      {cartItem ? (
        // Main container for the cart item card and totals
        <div>
          {/* Cart Item Card - Styled to match the image */}
          <div className="border border-gray-200 bg-white rounded-2xl shadow-sm p-4 flex gap-4">
            {/* Left side: Image */}
            <img
              src={cartItem.image}
              alt={cartItem.title}
              className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
            />

            {/* Right side: Details */}
            <div className="flex-1 flex flex-col">
              <h3 className="font-semibold text-xl">
                {cartItem.title}
              </h3>
              
              {/* Tags */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {cartItem.selectedFormat && (
                  <span className="px-3 py-1 text-sm bg-pink-100 text-pink-800 font-medium rounded-md">
                    {cartItem.selectedFormat}
                  </span>
                )}
                {cartItem.selectedLevel && (
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-800 font-medium rounded-md">
                    {cartItem.selectedLevel}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mt-2 text-sm leading-snug">
                {cartItem.description}
              </p>
              
              {/* Price and Remove Button (pushed to the bottom) */}
              <div className="flex justify-between items-center mt-auto pt-2">
                <span className="font-bold text-2xl text-gray-900">
                  ${cartItem.price}
                </span>
                <button
                  className="text-sm font-semibold"
                  onClick={onRemove}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Coupon Section */}
          <CouponSection
            totalPrice={totalPrice}
            onCouponApplied={handleCouponApplied}
            appliedCoupon={appliedCoupon}
            onRemoveCoupon={handleRemoveCoupon}
          />

          {/* Totals Section - Cleanly styled to follow the card */}
          <div className="space-y-3 text-base mt-8">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedCoupon?.code}):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-3">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-3">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-lg text-gray-500 py-12 border border-gray-200 rounded-2xl">
          Your cart is empty.
        </div>
      )}
    </>
  );
}

export default CartSection;