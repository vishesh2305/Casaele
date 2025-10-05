import React, { useState, useRef, useMemo, useEffect } from "react";
import ToggleButtons from "../components/Material/MaterialPage/ToggleButtons";
import SectionHeader from "../components/Material/MaterialPage/SectionHeader";
import CardSlider from "../components/Material/MaterialPage/CardSlider";
import SearchBar from "../components/Searchbar/Searchbar";
import { useLocation } from "react-router-dom";
import { apiGet } from "../utils/api"; // ✅ Import the apiGet utility

function MaterialPage() {
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("Explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // ✅ State to hold materials fetched from the backend
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardRef = useRef(null);
  const mostlyRef = useRef(null); // Keep this ref if you plan to have a second slider

  // ✅ Fetch materials from the backend when the component loads
  useEffect(() => {
    setLoading(true);
    apiGet('/api/materials')
      .then(data => {
        if (Array.isArray(data)) {
          setMaterials(data);
        } else {
          setMaterials([]); // Ensure materials is always an array
        }
      })
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter data based on the dynamic search query
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    // Search through the dynamically fetched materials
    return materials.filter(item =>
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  }, [searchQuery, materials]);

  const handleScroll = (ref, direction) => {
    const container = ref.current;
    if (container) {
      const cardWidth = 260;
      container.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  useEffect(() => {
    if (location.state?.keyword) {
      setActiveButton("Keyword");
    }
  }, [location.state]);

  if (loading) {
    return <div className="text-center p-20 font-semibold">Loading Materials...</div>;
  }



  return (
    <div
      className="
        w-full
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
        pb-10
      "
    >
      {/* Toggle Buttons */}
      <ToggleButtons
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />

      <SearchBar activeButton={activeButton} onSearch={handleSearch} />

      {/* Search Results Section */}
      {showSearchResults && (
        <div className="mt-6 sm:mt-8 md:mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Results ({searchResults.length})</h2>
            {/* <div className="text-sm text-gray-600">
              {searchQuery.toUpperCase()}
            </div> */}
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center flex justify-center py-12 -mt-11">
              <img
                src="/Material/errrorpage.svg"
                alt="No results"
                className=""
              />
            </div>
          )}
        </div>
      )}

      {/* Latest Chapters Section (hidden when search results are shown) */}
      {!showSearchResults && (
        <div className="mt-6 sm:mt-8 md:mt-10">
          <SectionHeader
            title="Latest Chapters Out Now!"
            onScrollLeft={() => handleScroll(cardRef, "left")}
            onScrollRight={() => handleScroll(cardRef, "right")}
          />
          <CardSlider ref={cardRef} data={materials} />
        </div>
      )}

      {/* Most Liked Section (hidden when search results are shown) */}
      {!showSearchResults && (
        <div className="mt-6 sm:mt-8 md:mt-10">
          <SectionHeader
            title="Most Liked!"
            onScrollLeft={() => handleScroll(mostlyRef, "left")}
            onScrollRight={() => handleScroll(mostlyRef, "right")}
          />
          <CardSlider ref={mostlyRef} data={[...materials].reverse()} />
        </div>
      )}
    </div>
  );
}

export default MaterialPage;