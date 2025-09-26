import React from "react";
import Card from "../Card/Card"; // Assuming Card component path

function LikeSection({ likecards, handleLikeCardClick }) {
  return (
    <div className="w-full">
      <h1 className="font-bold text-3xl sm:text-4xl mb-8 text-center">You might also like</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {likecards.map((card) => (
          <div key={card.id} onClick={() => handleLikeCardClick(card)} className="cursor-pointer">
            <Card {...card} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LikeSection;