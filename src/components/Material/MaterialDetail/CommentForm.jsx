import React, { useState } from "react";
import AuthForm from "../../../pages/LogIn";

function CommentForm() {

  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="w-full">
      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <input type="text" placeholder="Your Name *" className="border border-gray-300 px-4 py-3 rounded-xl w-full" />
        <input type="email" placeholder="Your Email *" className="border border-gray-300 px-4 py-3 rounded-xl w-full" />
        <input type="text" placeholder="Country *" className="border border-gray-300 px-4 py-3 rounded-xl w-full" />
        <input type="text" placeholder="Profession *" className="border border-gray-300 px-4 py-3 rounded-xl w-full" />
      </div>
      
      {/* Comment Textarea */}
      <div className="mb-6">
        <textarea
          placeholder="Comment"
          className="border border-gray-300 rounded-xl px-4 py-3 w-full h-32 resize-none"
        ></textarea>
      </div>

      {/* Post Button */}
      <div className="text-center">
        <button onClick={(e) => {
            e.preventDefault(); // prevent form submission
            setShowAuth(true); // open modal
          }} className="bg-[rgba(173,21,24,1)] text-white w-full py-3 rounded-full hover:bg-red-700 transition-colors font-semibold text-lg">
          Publicar el comentario
        </button>
      </div>

      {/* Modal */}
      {showAuth && <AuthForm onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default CommentForm;