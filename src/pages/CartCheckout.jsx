import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BillingDetails from '../components/CartCheckout/BillingDetails';
import CartSection from '../components/CartCheckout/CartSection';


function CartCheckout() {
  const location = useLocation();
  const { item: initialItem, quantity: initialQty } = location.state || {};
  const [cartItem, setCartItem] = useState(initialItem);
  const [quantity, setQuantity] = useState(initialQty || 1);
  const [finalTotal, setFinalTotal] = useState(0);

  const totalPrice = cartItem ? cartItem.price * quantity : 0;

  // Update final total when cart item or quantity changes
  useEffect(() => {
    setFinalTotal(totalPrice);
  }, [totalPrice]);

  const handlePlaceOrderRazorpay = async () => {
    const response = await fetch('http://localhost:5000/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: finalTotal * 100,
        currency: 'INR',
      }),
    });
    const order = await response.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'CasaDeEle',
      description: 'Course Purchase',
      order_id: order.id,
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: 'Your Name',
        email: 'your.email@example.com',
      },
      theme: { color: '#AD1518' },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };



  const handleRemove = () => {
    setCartItem(null);
    setQuantity(0);
  };

  if (!cartItem) {
    return (
      <div className="text-center text-lg sm:text-xl my-16 sm:my-24 px-4">
        No product in cart. Please go back and add one.
      </div>
    );
  }

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
          onTotalUpdate={setFinalTotal}
        />


        <button
          onClick={handlePlaceOrderRazorpay}
          className="bg-[rgba(173,21,24,1)] text-white py-3 px-6 rounded-full w-full mt-10 hover:bg-red-800 transition-colors"
          disabled={!cartItem}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default CartCheckout;
