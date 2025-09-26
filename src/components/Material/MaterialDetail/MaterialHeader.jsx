import React from "react";

function MaterialHeader({ material }) {
  return (
    <div className="w-full pt-12 sm:pt-16">
      {/* Image */}
      <div className="w-full mb-12 sm:mb-16">
        <img
          src={material.image}
          alt={material.title}
          className="w-full h-auto rounded-2xl object-cover"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {material.title}
          </h2>
          <p className="text-gray-500 text-sm">
            29 abril 2025. Última Actualización: 12 junio 2025
          </p>
          <p className="text-gray-800 text-lg font-semibold">
            {material.description}
          </p>
          <p className="text-gray-700 text-base leading-relaxed">
            Cortometraje animado sobre la migración, construido a partir de
            testimonios reales de personas migrantes hispanoamericanas, para
            trabajar la expresión y el léxico relacionado.
          </p>
        </div>

        {/* Right Column */}
        <div className="w-full h-full border-4 border-dashed border-red-300 p-6 rounded-2xl bg-white">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Ideas y sugerencias para la clase
          </h3>
          <p className="text-gray-700 text-base leading-relaxed space-y-4">
            <span>
              Etiam condimentum duis molestie malesuada volutpat pellentesque sed.
              Ornare suspendisse ut ac neque lobortis sed tincidunt. Mi tempus
              quis massa tellus imperdiet aenean nulla id.
            </span>
            <span>
              Etiam condimentum duis molestie malesuada volutpat pellentesque sed.
              Ornare suspendisse ut ac neque lobortis sed tincidunt.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MaterialHeader;