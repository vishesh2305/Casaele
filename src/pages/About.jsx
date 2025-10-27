import React, { useState, useEffect } from "react"; // ++ Import hooks
import { apiGet } from "../utils/api"; // ++ Import apiGet
import CmsContent from "../components/CmsContent";
import WhereEle from "../components/About/WhereEle";
import GardenSection from "../components/About/GardenSection";
import SuggestionsSection from "../components/Home/SuggestionsSection";

export default function About() {
  // ++ Add state for the fetched CMS data ++
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ++ Fetch the 'about-us' CMS data directly ++
  useEffect(() => {
    apiGet('/api/cms/slug/about-us')
      .then(data => setCmsData(data))
      .catch(err => console.error("Failed to load About page CMS data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-white flex items-center justify-center py-12 sm:py-16 px-4 sm:px-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Side: Conditionally render Embed or Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            {loading ? (
              // Loading placeholder
              <div className="w-48 h-48 sm:w-72 sm:h-72 md:w-[26rem] md:h-[26rem] lg:w-[32rem] lg:h-[32rem] xl:w-[34rem] xl:h-[34rem] bg-gray-200 rounded-lg animate-pulse"></div>
            ) : cmsData?.secondSectionEmbed ? (
               // ++ Render the embed if it exists ++
               <div 
                 className="w-full max-w-xl aspect-video border rounded-lg overflow-hidden shadow-sm" // Use aspect-video or specific sizing
                 dangerouslySetInnerHTML={{ __html: cmsData.secondSectionEmbed.embedCode }} 
               />
            ) : cmsData?.imageUrl ? (
              // Fallback to CMS image if no embed selected
              <img
                src={cmsData.imageUrl}
                alt="About Ele"
                className="w-48 sm:w-72 md:w-[26rem] lg:w-[32rem] xl:w-[34rem]"
              />
            ) : (
              // Fallback if neither embed nor image is set
               <img
                src="/About/image 52.svg" // Original fallback
                alt="About Ele Illustration"
                className="w-48 sm:w-72 md:w-[26rem] lg:w-[32rem] xl:w-[34rem]"
              />
            )}
          </div>
          
          {/* Right Side Box - Content */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="border-2 border-dashed border-red-400 bg-[#FDF2F2] p-6 sm:p-8 rounded-3xl shadow-sm w-full max-w-xl">
              {/* Use CmsContent component only for the text content */}
              <CmsContent slug="about-us" showImage={false} />
            </div>
          </div>
        </div>
      </section>

      <WhereEle />
      <GardenSection />
      <SuggestionsSection />
    </>
  );
}