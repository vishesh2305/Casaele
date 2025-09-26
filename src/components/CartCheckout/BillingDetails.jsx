import React from 'react';

function BillingDetails() {
  return (
    <div className="flex flex-col w-full mt-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6">Billing Details</h1>

      <input type="text" placeholder="Your Name *" className="mb-4 p-3 border rounded-full w-full" />
      <input type="email" placeholder="Your Email *" className="mb-4 p-3 border rounded-full w-full" />
      <input type="text" placeholder="Country *" className="mb-4 p-3 border rounded-full w-full" />
      <input type="tel" placeholder="Phone Number *" className="mb-4 p-3 border rounded-full w-full" />
      <input type="text" placeholder="Apartment, floor, etc." className="mb-4 p-3 border rounded-full w-full" />
      <input type="text" placeholder="Town/City *" className="mb-4 p-3 border rounded-full w-full" />

      <label className="flex items-center space-x-2 mt-2">
        <input type="checkbox" className="accent-red-500 w-5 h-5" />
        <span className="text-sm font-normal">Save this information for faster check-out next time</span>
      </label>
    </div>
  );
}

export default BillingDetails;