import React from 'react';
import CmsContent from '../components/CmsContent'; // Import the new component

export default function TermsAndConditions() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-gray-50 to-gray-100/60">
      <div className="px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white/60 backdrop-blur border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">Terms & Conditions</h1>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-100">Dynamic Content</span>
            </div>
            <div className="h-px bg-gradient-to-r from-red-200/60 via-gray-200 to-transparent mt-6" />

            <div className="mt-6">
              <div className="rounded-xl bg-white/80 backdrop-blur border border-gray-200 shadow p-5 sm:p-6">
                 {/* Use the CmsContent component with the correct slug */}
                <CmsContent slug="terms-and-conditions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}