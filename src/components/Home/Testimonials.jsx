import React, { useState, useEffect } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

function Testimonials() {
  const testimonials = [
    {
      text: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperioresItaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      img: "Home/Ellipse 756.svg",
      name: "Sarah Levi",
      location: "France",
    },
    {
      text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores",
      img: "Home/Ellipse 755.svg",
      name: "Sarah Levi",
      location: "India",
    },
    {
      text: "Cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
      img: "Home/Ellipse 754.svg",
      name: "Levi Fisher",
      location: "Russia",
    },
    {
      text: "This is another testimonial to demonstrate the functionality with more items. It is intentionally made longer than the others to show the text truncation in action. The card size will not change.",
      img: "Home/Ellipse 755.svg",
      name: "John Doe",
      location: "USA",
    },
    {
      text: "A final, shorter testimonial.",
      img: "Home/Ellipse 756.svg",
      name: "Jane Smith",
      location: "Canada",
    },
    {
      text: "One more for the road! This ensures the pagination works correctly.",
      img: "Home/Ellipse 754.svg",
      name: "Alex Ray",
      location: "UK",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const CHARACTER_LIMIT = 180;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - itemsPerPage;
      const lastPossibleIndex = Math.floor((testimonials.length - 1) / itemsPerPage) * itemsPerPage;
      return newIndex < 0 ? lastPossibleIndex : newIndex;
    });
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + itemsPerPage;
      return newIndex >= testimonials.length ? 0 : newIndex;
    });
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="text-center font-bold text-black text-2xl sm:text-3xl md:text-4xl mb-10 md:mb-12">
        Testimonials
      </h1>

      {/* Main container is now relative for button positioning */}
      <div className="relative">
        <button
          onClick={handlePrev}
          // Buttons are positioned absolutely
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 bg-white border border-gray-300 rounded-full p-3 shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Previous Testimonial"
        >
          <GoArrowLeft className="text-gray-600 text-2xl" />
        </button>

        {/* This container adds padding on mobile to create space */}
        <div className="w-full flex justify-center gap-6 px-12 md:px-0">
          {visibleTestimonials.map((t, index) => (
            <div
              key={index}
              className="w-full sm:w-72 lg:w-64 h-96 flex-shrink-0 flex flex-col bg-white p-6 rounded-xl"
            >
              <img
                src="Home/Frame.svg"
                alt="Quote"
                className="w-10 mx-auto mb-4 flex-shrink-0"
              />
              
              <p className="flex-grow text-sm mb-4 font-medium leading-snug overflow-hidden">
                {t.text.length > CHARACTER_LIMIT
                  ? `${t.text.substring(0, CHARACTER_LIMIT)}...`
                  : t.text}
              </p>
              
              <div className="flex items-center justify-center space-x-3 flex-shrink-0 border-t pt-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-left">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 bg-white border border-gray-300 rounded-full p-3 shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Next Testimonial"
        >
          <GoArrowRight className="text-gray-600 text-2xl" />
        </button>
      </div>
    </div>
  );
}

export default Testimonials;