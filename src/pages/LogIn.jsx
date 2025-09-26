import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

function AuthForm({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-6"
      onClick={onClose} // close on overlay click
    >
      {/* Modal Card */}
      <div
        className="relative bg-white rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-center font-bold text-xl sm:text-2xl md:text-3xl mb-6">
          {isLogin ? "Login" : "Signup"}
        </h2>

        {/* Google Auth */}
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 hover:bg-gray-100 transition mb-6 text-sm sm:text-base">
          <img src="/LogIn/Google__G__logo 1.svg" alt="" />
          <span>{isLogin ? "Login" : "Signup"} with Google</span>
        </button>

        {/* OR Divider */}
        <div className="flex items-center gap-2 my-6 text-sm sm:text-base">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Name (Signup only) */}
        {!isLogin && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border-b border-gray-400 focus:outline-none focus:border-red-500 py-2 placeholder-black placeholder:font-normal text-sm sm:text-base"
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border-b border-gray-400 focus:outline-none focus:border-red-500 py-2 placeholder-black text-sm sm:text-base"
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={isLogin ? "Password" : "Create Password"}
            className="w-full border-b border-gray-400 focus:outline-none focus:border-red-500 py-2 placeholder-black text-sm sm:text-base"
          />
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {/* Submit */}
        <button className="w-full bg-red-700 text-white py-2 rounded-md font-semibold hover:bg-red-800 transition text-sm sm:text-base mb-4">
          {isLogin ? "Login" : "Signup"}
        </button>

        {/* Toggle */}
        <p className="text-center text-sm sm:text-base text-gray-600">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span
            className="text-red-700 font-medium cursor-pointer"
            onClick={() => {
              setIsLogin(!isLogin);
              setShowPassword(false);
            }}
          >
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>
      </div>

      {/* Ele Mascot + Bubble */}
      <div className="hidden sm:flex absolute bottom-4 sm:bottom-6 md:bottom-10 right-4 sm:right-6 md:right-10 flex-col items-center gap-2 sm:gap-3 z-20">
        <div className="relative bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 shadow-md max-w-[180px] sm:max-w-[220px] text-xs sm:text-sm md:text-sm text-gray-700">
          {isLogin
            ? "Login for the best experience!"
            : "Signup to unlock the reach!"}{" "}
          <span className="text-red-500">~Ele</span>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-b-6 border-l-6 border-transparent border-l-white sm:border-t-8 sm:border-b-8 sm:border-l-8"></div>
        </div>
        <img
          src="LogIn/image 56 (1).svg"
          alt="Ele Mascot"
          className="w-16 sm:w-20 md:w-28"
        />
      </div>
    </div>
  );
}

export default AuthForm;