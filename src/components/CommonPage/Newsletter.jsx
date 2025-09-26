import React, { useState } from "react";
import AuthForm from "../../pages/LogIn";

const Newsletter = () => {
  const roles = ["Teacher", "Student", "Explorer"];

  const [showAuth, setShowAuth] = useState(false);

  return (
    <section className="py-20 px-8 bg-[#FDF2F2] text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-4xl font-bold text-gray-800 mb-4">
          Stay Updated with Ele’s Newsletters
        </h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          Get weekly Spanish tips, new content updates, and exclusive resources
          delivered to your inbox!
        </p>

        {/* Role Selection without state */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {roles.map((role, i) => (
            <React.Fragment key={role}>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={role}
                  defaultChecked={i === 0} // by default Teacher selected
                  className="hidden peer"
                />
                <span className="text-lg text-gray-500 peer-checked:font-bold peer-checked:text-gray-800 hover:text-gray-800 transition-colors duration-300">
                  {role}
                </span>
              </label>
              {i < roles.length - 1 && (
                <span className="text-gray-300 text-2xl">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Subscription Form */}
        <form
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 w-full px-6 py-4 bg-[#FDF2F2] text-gray-700 placeholder-gray-400 focus:outline-none rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-red-400"
            aria-label="Email for newsletter"
          />
          <button
            onClick={(e) => {
            e.preventDefault(); // prevent form submission
            setShowAuth(true); // open modal
          }}
            type="submit"
            className="bg-[rgba(173,21,24,1)] hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold transition-transform transform hover:scale-105 shadow-md w-full sm:w-auto"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Modal */}
      {showAuth && <AuthForm onClose={() => setShowAuth(false)} />}

    </section>
  );
};

export default Newsletter;
