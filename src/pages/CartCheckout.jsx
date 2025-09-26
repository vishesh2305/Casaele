import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BillingDetails from '../components/CartCheckout/BillingDetails';
import CartSection from '../components/CartCheckout/CartSection';
import PaymentMethods from '../components/CartCheckout/PaymentMethods';

function CartCheckout() {
  const location = useLocation();
  const { item: initialItem, quantity: initialQty } = location.state || {};
  const [cartItem, setCartItem] = useState(initialItem);
  const [quantity, setQuantity] = useState(initialQty || 1);

  if (!cartItem) {
    return (
      <div className="text-center text-lg sm:text-xl my-16 sm:my-24 px-4">
        No product in cart. Please go back and add one.
      </div>
    );
  }

  const totalPrice = cartItem.price * quantity;

  const handleRemove = () => {
    setCartItem(null);
    setQuantity(0);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between px-4 sm:px-6 md:px-10 lg:px-12 xl:px-20 my-16">
      {/* Billing */}
      <div className="w-full lg:w-[55%] mb-10 lg:mb-0">
        <BillingDetails />
      </div>

      {/* Cart & Payment */}
      <div className="w-full lg:w-[40%] lg:ml-4">
        <CartSection
          cartItem={cartItem}
          onRemove={handleRemove}
          quantity={quantity}
          totalPrice={totalPrice}
        />
        <PaymentMethods />
        <button
          className="bg-[rgba(173,21,24,1)] text-white py-3 px-6 rounded-full w-full mt-10"
          disabled={!cartItem}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default CartCheckout;