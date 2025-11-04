import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io"; // Using a common down arrow icon
import AuthForm from "../../pages/LogIn";
import { auth, onAuthStateChanged, signOut } from "../../firebase";
import { apiGet } from "../../utils/api"; // 1. Import apiGet to check admin status

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("Spanish");
  const langDropdownRef = useRef(null);
  const { pathname } = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // 2. Add state for admin status

  // 3. Remove "Admin Login" from the main links array
  const links = [
    { name: "Material", path: "/material" },
    { name: "School", path: "/school" },
    { name: "Courses", path: "/courses" },
    { name: "Products", path: "/products" },
    { name: "About Ele", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    // { name: "Admin Login", path: "/admin/login" }, // This is now removed
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langDropdownRef]);

  // 4. Update auth listener to check for admin privileges
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => { // Made async
      setCurrentUser(u || null);

      if (u) {
        // User is logged in, check if they are an admin
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            // Verify token with the backend, just like in RequireAuth
            await apiGet("/api/admins/check-status");
            setIsAdmin(true);
          } catch (error) {
            // Token is invalid or user is not an admin
            setIsAdmin(false);
            localStorage.removeItem("authToken"); // Clean up invalid token
          }
        } else {
          setIsAdmin(false);
        }
      } else {
        // User is logged out, ensure admin status is false and token is cleared
        setIsAdmin(false);
        localStorage.removeItem("authToken");
      }
    });
    return () => unsub();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setIsLangOpen(false);
  };

  // 5. Create a new logout handler to also clear admin token
  const handleLogout = () => {
    signOut(auth);
    localStorage.removeItem("authToken"); // Clear the admin token
    setIsAdmin(false); // Reset admin state
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-4 sm:px-8 lg:px-16 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/Horizontal_1.svg"
            alt="CasaDeEle Logo"
            className="h-8 w-auto"
          />
        </Link>

        {/* Language Dropdown */}
        <div className="relative" ref={langDropdownRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            <span>{selectedLang}</span>
            <IoIosArrowDown
              className={`transition-transform duration-200 ${
                isLangOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isLangOpen && (
            <div className="absolute top-full mt-2 w-36 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => handleLangSelect("Spanish")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Spanish
              </button>
              <button
                onClick={() => handleLangSelect("English")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                English
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`transition-colors ${
              pathname === link.path
                ? "text-black font-semibold"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {link.name}
          </Link>
        ))}

        {/* 6. Conditionally render Admin Dashboard link for desktop */}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className={`transition-colors ${
              pathname.startsWith("/admin")
                ? "text-black font-semibold"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Admin Dashboard
          </Link>
        )}
      </nav>

      {/* Auth button / user dropdown */}
      <div className="hidden md:flex items-center">
        {!currentUser ? (
          <button
            onClick={() => setShowAuth(true)}
            className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800 text-sm"
          >
            Login / Signup
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">
              {currentUser.displayName || currentUser.email}
            </span>
            {/* 7. Use the new handleLogout function */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Hamburger Button (only for mobile) */}
      <button
        className="md:hidden text-gray-600 text-2xl z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Navbar */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-8 md:hidden z-40">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-2xl transition-colors ${
                pathname === link.path
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setIsMenuOpen(false)} // Close menu on link click
            >
              {link.name}
            </Link>
          ))}

          {/* 8. Conditionally render Admin Dashboard link for mobile */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className={`text-2xl transition-colors ${
                pathname.startsWith("/admin")
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}

      {showAuth && <AuthForm onClose={() => setShowAuth(false)} />}
    </header>
  );
};

export default Header;