import React, { useState, useRef, useMemo, useEffect } from "react";
import ToggleButtons from "../components/Material/MaterialPage/ToggleButtons";
import SectionHeader from "../components/Material/MaterialPage/SectionHeader";
import CardSlider from "../components/Material/MaterialPage/CardSlider";
import SearchBar from "../components/Searchbar/Searchbar";
// *** CHANGED: Import Link ***
import { useLocation, Link } from "react-router-dom"; 
import { apiGet } from "../utils/api";

function MaterialPage() {
  const location = useLocation();
  // *** CHANGED: Removed useNavigate ***
  const [activeButton, setActiveButton] = useState("Explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // *** CHANGED: Removed Modal State ***
  // const [activeBannerUrl, setActiveBannerUrl] = useState(null);
  // const [showBannerModal, setShowBannerModal] = useState(false);

  const cardRef = useRef(null);
  const mostlyRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    apiGet('/api/materials')
    .then((materialsData) => {
      setMaterials(Array.isArray(materialsData) ? materialsData : []);
    })
    .catch(() => {
      setMaterials([]);
    })
    .finally(() => setLoading(false));
  }, []);

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

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return materials.filter(item =>
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  }, [searchQuery, materials]);

  useEffect(() => {
    if (location.state?.keyword) {
      setActiveButton("Keyword");
      handleSearch(location.state.keyword);
    }
  }, [location.state]);

  // *** CHANGED: Removed handleCardClick function ***

  if (loading) {
    return <div className="text-center p-20 font-semibold">Loading Materials...</div>;
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-10">
      
      <ToggleButtons activeButton={activeButton} setActiveButton={setActiveButton} />
      <SearchBar activeButton={activeButton} onSearch={handleSearch} />

      {showSearchResults ? (
        <div className="mt-6 sm:mt-8 md:mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Results ({searchResults.length})</h2>
          </div>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((item) => (
                // *** CHANGED: Wrapped search result in a Link ***
                <Link 
                  key={item._id} 
                  to={`/material-detail/${item._id}`}
                  state={{ material: item }}
                  className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.fileUrl || "https://placehold.co/400x300/e5e7eb/4b5563?text=Image"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center flex justify-center py-12 -mt-11">
              <img src="/Material/errrorpage.svg" alt="No results" />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-6 sm:mt-8 md:mt-10">
            <SectionHeader
              title="Latest Chapters Out Now!"
              onScrollLeft={() => handleScroll(cardRef, "left")}
              onScrollRight={() => handleScroll(cardRef, "right")}
            />
            {/* *** CHANGED: Removed onCardClick prop *** */}
            <CardSlider ref={cardRef} data={materials} />
          </div>

          <div className="mt-6 sm:mt-8 md:mt-10">
            <SectionHeader
              title="Most Liked!"
              onScrollLeft={() => handleScroll(mostlyRef, "left")}
              onScrollRight={() => handleScroll(mostlyRef, "right")}
            />
            {/* *** CHANGED: Removed onCardClick prop *** */}
            <CardSlider ref={mostlyRef} data={[...materials].reverse()} />
          </div>
        </>
      )}

      {/* *** CHANGED: Removed Banner Modal JSX *** */}
    </div>
  );
}

export default MaterialPage;