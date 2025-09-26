import React from "react";

function DetailedInfo() {
  return (
    <div className="w-full">
      <h1 className="font-bold text-3xl sm:text-4xl mb-6">Detailed information</h1>
      <div className="space-y-4 text-gray-600 text-base leading-relaxed">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Lorem ipsum dolor sit amet, consectetur</li>
          <li>adipisicing elit, sed do eiusmod tempor</li>
          <li>ut labore et dolore magna aliqua. Ut enim</li>
          <li>veniam, quis nostrud exercitation</li>
        </ul>
      </div>
    </div>
  );
}

export default DetailedInfo;