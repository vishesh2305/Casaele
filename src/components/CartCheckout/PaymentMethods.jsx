import React from 'react';

function PaymentMethods() {
  return (
    <div className="mt-8 space-y-4 w-full">
      {/* Bank */}
      <div className="flex justify-between items-center w-full gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <input
            type="radio"
            id="bank"
            name="payment"
            defaultChecked
            className="w-5 h-5 accent-black"
          />
          <label htmlFor="bank" className="font-normal text-base cursor-pointer">
            Bank
          </label>
        </div>
        {/* Added flex-wrap here */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <img src="/Cart/image 32.svg" alt="bank" className="h-6" />
          <img src="/Cart/visa.svg" alt="visa" className="h-6" />
          <img src="/Cart/mastercard.svg" alt="mc" className="h-6" />
          <img src="/Cart/rupay.svg" alt="rupay" className="h-6" />
        </div>
      </div>

      {/* PayPal */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2 flex-shrink-0">
          <input
            type="radio"
            id="paypal"
            name="payment"
            className="w-5 h-5 accent-black"
          />
          <label htmlFor="paypal" className="font-normal text-base cursor-pointer">
            PayPal
          </label>
        </div>
        <img src="/Cart/paypal.svg" alt="paypal" className="h-7" />
      </div>

      {/* COD */}
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="cod"
          name="payment"
          className="w-5 h-5 accent-black"
        />
        <label htmlFor="cod" className="font-normal text-base cursor-pointer">
          Cash on delivery
        </label>
      </div>
    </div>
  );
}

export default PaymentMethods;