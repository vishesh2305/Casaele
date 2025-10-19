import React from "react";

function MaterialHeader({ material }) {
  const displayImage = material.fileUrl && material.fileUrl.trim() !== '' ? material.fileUrl : (material.image && material.image.trim() !== '' ? material.image : "https://placehold.co/1200x800/e5e7eb/4b5563?text=Image");

  // Get the embed code safely, whether embedId is populated or not
  const embedCode = typeof material.embedId === 'object' && material.embedId !== null
    ? material.embedId.embedCode
    : '';

  return (
    <div className="w-full pt-12 sm:pt-16">
      <div className="w-full mb-12 sm:mb-16">
        <img
          src={displayImage}
          alt={material.title}
          className="w-full h-auto rounded-2xl object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {material.title}
          </h2>
          <p className="text-gray-500 text-sm">
            Created on:{" "}
            {material.createdAt
              ? new Date(material.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="text-gray-800 text-lg font-semibold">
            {material.description}
          </p>
          <p className="text-gray-700 text-base leading-relaxed">
            {material.content ||
              "Cortometraje animado sobre la migración, construido a partir de testimonios reales de personas migrantes hispanoamericanas, para trabajar la expresión y el léxico relacionado."}
          </p>

          {/* H5P/AI Embedded Content */}
          {embedCode && material.embedType && (
            <div className="mt-8 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-4">{material.embedType} Content</h3>
              <div 
                className="embed-container w-full min-h-[400px]" 
                dangerouslySetInnerHTML={{ __html: embedCode }} 
              />
            </div>
          )}
        </div>

        <div className="w-full h-full border-4 border-dashed border-red-300 p-6 rounded-2xl bg-white">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Ideas y sugerencias para la clase
          </h3>
          <p className="text-gray-700 text-base leading-relaxed">
            Additional notes or suggestions related to this material can be
            displayed here. This section can also be powered by a field from
            your admin panel in the future.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MaterialHeader;