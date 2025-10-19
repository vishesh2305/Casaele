import React, { useState, useEffect, useMemo } from "react";
import { Link } from 'react-router-dom'; // 1. Import Link
import { apiGet, apiSend } from "../utils/api";
import { FiTrash2 } from 'react-icons/fi';

function Garden() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  const isAdmin = useMemo(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin' || payload.email === import.meta.env.VITE_SUPER_ADMIN_EMAIL;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await apiGet('/api/posts');
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiSend(`/api/posts/${postId}`, 'DELETE');
        setPosts(posts.filter(p => p._id !== postId));
      } catch (error) {
        alert(`Failed to delete post: ${error.message}`);
      }
    }
  };

return (
    <div className="font-sans text-gray-800">
      <section className="flex justify-center items-center w-full bg-white py-16">
        <div className="w-full max-w-6xl text-center px-6">
          <h1 className="text-4xl font-bold text-black py-16">
            El jardín de ideas
          </h1>
          <p className="text-2xl text-center text-black mb-12">
            Explore our garden of ideas! Here you'll find creative content, updates, and inspiration for your Spanish learning journey.
          </p>
          
          {loading ? (
            <div className="py-12">Loading ideas...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                // 2. Wrap the card in a Link component
                <Link to={`/garden-of-ideas/${post._id}`} key={post._id} className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col group">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6 text-left flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">{post.title}</h3>
                    <p className="text-gray-600 text-sm flex-grow line-clamp-3">{post.description}</p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when deleting
                        handleDelete(post._id);
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Post"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Garden;