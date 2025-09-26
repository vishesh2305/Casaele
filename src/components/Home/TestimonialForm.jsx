import { useState } from "react";
import AuthForm from "../../pages/LogIn";

function TestimonialForm() {

  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-center font-medium text-2xl sm:text-3xl mb-10">
        Write a testimonial
      </h2>

      {/* Input Fields */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
        {/* Your Name */}
        <input
          type="text"
          placeholder="Your Name *"
          className="border border-gray-300 placeholder-gray-500 px-5 py-3 rounded-lg w-full sm:w-[225px] focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Your Email */}
        <input
          type="email"
          placeholder="Your Email *"
          className="border border-gray-300 placeholder-gray-500 px-5 py-3 rounded-lg w-full sm:w-[225px] focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Country */}
        <input
          type="text"
          placeholder="Country *"
          className="border border-gray-300 placeholder-gray-500 px-5 py-3 rounded-lg w-full sm:w-[225px] focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Profession */}
        <input
          type="text"
          placeholder="Profession *"
          className="border border-gray-300 placeholder-gray-500 px-5 py-3 rounded-lg w-full sm:w-[225px] focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Level */}
        <input
          type="text"
          placeholder="Level (A – C)"
          className="border border-gray-300 placeholder-gray-500 px-5 py-3 rounded-lg w-full sm:w-[220px] focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Comment */}
        <textarea
          placeholder="Comment"
          className="border border-gray-300 placeholder-gray-500 rounded-xl px-5 py-3 w-full sm:w-[600px] h-[160px] resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
        ></textarea>

        {/* Upload Video */}
        <div className="border border-gray-300 rounded-xl w-full sm:w-[600px] h-[160px] flex items-center justify-center text-gray-500 cursor-pointer hover:border-gray-600 transition-colors duration-200">
          <div className="flex flex-row items-center justify-center space-x-2">
            <span className="text-base">Upload Video</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ marginLeft: "6px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-4 4m4-4l4 4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Post Button */}
      <div className="text-center">
        <button
        onClick={(e) => {
            e.preventDefault(); // prevent form submission
            setShowAuth(true); // open modal
          }} className="bg-[rgba(173,21,24,1)] hover:bg-red-700 text-white w-full  py-3 rounded-full transition-all">
          Post
        </button>
      </div>

      {/* Modal */}
      {showAuth && <AuthForm onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default TestimonialForm;
