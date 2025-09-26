import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

function DropDown() {
  const [active, setActive] = useState(null);

  const data = [
    { q: "Ejercicio 1 - Itaque earum rerum hic tenetur a sapiente delectus", a: "Contenido del Ejercicio 1...", img: "/Material/cartoon2.svg" },
    { q: "Ejercicio 2 - Ut aut reiciendis voluptatibus maiores alias", a: "Contenido del Ejercicio 2...", img: "/Material/cartoon1.svg" },
    { q: "Ejercicio 3 - Nemo enim ipsam voluptatem quia voluptas", a: "Contenido del Ejercicio 3...", img: "/Material/cartoon2.svg" },
    { q: "Ejercicio 4 - Quis autem vel eum iure reprehenderit", a: "Contenido del Ejercicio 4...", img: "/Material/cartoon1.svg" },
  ];

  return (
    <div className="w-full">
      {/* Heading + Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
          Ejercicios
        </h1>
        <button className="bg-black text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors">
          + ABRIR TODO
        </button>
      </div>

      {/* Dropdown Items */}
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 sm:p-5">
            {/* Question Row */}
            <div
              className="flex items-center justify-between cursor-pointer gap-4"
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="flex items-center gap-4">
                <img src={item.img} alt="icon" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <p className="text-base font-medium text-gray-800">{item.q}</p>
              </div>
              <FaAngleDown
                className={`text-xl text-gray-500 transition-transform duration-300 flex-shrink-0 ${active === i ? "rotate-180" : ""}`}
              />
            </div>

            {/* Answer */}
            {active === i && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="text-gray-600 text-base leading-relaxed">
                  {item.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropDown;