import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiSend } from '../../utils/api';
import { FiPlus, FiEdit, FiTrash2, FiRefreshCw, FiImage } from 'react-icons/fi';

function GardenContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/api/posts');
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await apiSend(`/api/posts/${postId}`, 'DELETE');
        fetchPosts(); // Refresh the list after deleting
      } catch (error) {
        alert(`Failed to delete content: ${error.message}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Garden of Ideas Content</h1>
        <div className="flex items-center gap-2">
          <button onClick={fetchPosts} disabled={loading} className="px-3 py-1.5 rounded-md border hover:bg-gray-50 transition"><FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={() => navigate('/admin/content-upload')} className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800 flex items-center gap-2">
            <FiPlus /> Add New
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img src={post.imageUrl} alt={post.title} className="h-12 w-16 object-cover rounded-md border" />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{post.title}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => navigate(`/admin/content-upload/${post._id}`)} className="p-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"><FiEdit /></button>
                    <button onClick={() => handleDelete(post._id)} className="p-2 rounded bg-red-50 text-red-700 hover:bg-red-100"><FiTrash2 /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GardenContent;