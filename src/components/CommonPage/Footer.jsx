import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white px-6 md:px-12 lg:px-20 py-12 mt-12">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm text-gray-600">

        {/* Left Side - Brand Info */}
        <div className="pl-2 md:pl-6 lg:pl-10">
          <h3 className="font-bold text-2xl mb-4 text-gray-800">CasaDeEle</h3>
          <p className="text-gray-600 mb-4">
            Learn Spanish with Ele, your friendly alien guide, through
            interactive rooms and engaging content.
          </p>
          <div className="text-gray-600">
            <p>
              <span className="font-semibold">Visión de:</span>
              <a href="https://www.linkedin.com/in/amrit-goyal-9980b1128/" target="_blank" rel="noopener noreferrer" className="ml-1 hover:underline">
                Amrit Goyal
              </a>
            </p>
            <p>
              {/* <span className="font-semibold">Diseño web:</span> El quipo */}
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap items-center gap-3 mt-6 text-gray-500">
            <a href="https://www.instagram.com/casa_de_ele/" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 hover:bg-red-600 hover:text-white transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/casa_de_ele/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 hover:bg-red-600 hover:text-white transition">
              <i className="fab fa-instagram"></i>
            </a>
            {/* X (Twitter new icon) */}
            <a href="https://x.com/AmritGoyal74560" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 hover:bg-red-600 hover:text-white transition">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/company/casa-de-ele/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 hover:bg-red-600 hover:text-white transition">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.youtube.com/@CasadeELE" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 hover:bg-red-600 hover:text-white transition">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://in.pinterest.com/ELEconAmrit/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 hover:bg-red-600 hover:text-white transition">
              <i className="fab fa-pinterest"></i>
            </a>
            {/* Spotify added */}
            <a href="https://open.spotify.com/user/spotify_username_here" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 hover:bg-red-600 hover:text-white transition">
              <i className="fab fa-spotify"></i>
            </a>
          </div>
        </div>

        {/* Right Side - Explore + Learning + Support */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Explore */}
          <div>
            <h3 className="font-bold mb-3">Explore</h3>
            <ul className="space-y-2">
              <li>All Rooms</li>
              <li><a href="/material">Courses</a></li>
              <li><a href="/about">About Ele</a></li>
              <li><a href="/shop">Shop</a></li>
              <li>Newsletter</li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h3 className="font-bold mb-3">Learning</h3>
            <ul className="space-y-2">
              <li>Engineers & IT</li>
              <li>Teacher Forum</li>
              <li>IB Spanish</li>
              <li>Music</li>
              <li>Movies</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-3">Support</h3>
            <ul className="space-y-2">
              <li><a href="/contact">Contact Us</a></li>
              <li>Privacy Policy</li>
              <li>How to use</li>
              <li>Terms of Services</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar (Full Width Border) */}
      <div className="w-full border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 pt-8 flex justify-center items-center text-sm text-gray-500 text-center">
          <p>
            © 2025 CasaDeEle. All rights reserved. Made with love for Spanish
            learners worldwide.
          </p>
        </div>
      </div>

    </footer>
  )
}

export default Footer
