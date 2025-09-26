import React, { useState } from "react";

function Garden() {

  const [idea, setIdea] = useState("");

  const handleSubmit = () => {
    if (idea.trim() === "") {
      alert("Please enter your idea before submitting!");
      return;
    }
    alert(`Your idea: "${idea}" has been submitted 🌱`);
    setIdea(""); // clear textarea
  };

  return (
    <div className="font-sans text-gray-800 ">

      {/* Garden Section */}
      <section className="flex justify-center items-center w-full bg-white py-16">
        <div className="w-full max-w-6xl text-center px-6">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-black py-16">
            El jardín de ideas
          </h1>
          <p className="text-2xl text-center text-black mb-12">Share your thoughts and suggestions to help us grow CasaDeELE <br /> and make your Spanish learning journey even better.</p>
          {/* Plant Images */}
          <div className="flex justify-center flex-wrap gap-8 mb-12">
            <img src="GardenOfIdeas\a-2d-digital-illustration-of-a-glowing-spiral-shap.svg" alt="plant 1" className="w-[150px] h-[150px]" />
            <img src="GardenOfIdeas\a-2d-digital-illustration-of-a-small--bright-green.svg" alt="plant 2" className="w-[150px] h-[150px]" />
            <img src="GardenOfIdeas\a-2d-digital-illustration-of-a-small-alien-plant-w.svg" alt="plant 3" className="w-[150px] h-[150px]" />
            <img src="GardenOfIdeas\a-2d-digital-illustration-of-a-tiny-alien-plant-wi.svg" alt="plant 4" className="w-[150px] h-[150px]" />
            <img src="GardenOfIdeas\a-2d-digital-illustration-of-a-whimsical-alien-sap.svg" alt="plant 5" className="w-[150px] h-[150px]" />
            <img src="GardenOfIdeas\a-2d-digital-illustration-of-an-alien-plant-with-c.svg" alt="plant 6" className="w-[150px] h-[150px]" />
          </div>

          {/* Text Area + Button */}
          <div className="flex flex-col items-center gap-6">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your idea"
              className="w-full max-w-3xl h-[150px] px-4 py-3 rounded-xl border border-gray-300 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              onClick={handleSubmit}
              className="w-full max-w-3xl h-[55px] bg-[rgba(173,21,24,1)] text-white font-semibold rounded-full hover:bg-red-700 transition"
            >
              Plant Your Idea
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Garden;
