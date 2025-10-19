import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiBookOpen,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiImage,
  FiSave,
  FiX
} from 'react-icons/fi';
import { apiGet, apiSend } from '../../utils/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    images: [],
    imageSource: '',
    price: 0,
    level: 'beginner',
    language: 'Spanish',
    instructor: 'CasaDeELE Team',
    modules: []
  });
  const [imgMode, setImgMode] = useState('local');
  const [pinUrl, setPinUrl] = useState('');
  const [pinPreview, setPinPreview] = useState(null);
  const [uploading, setUploading] = useState(false);


  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter })
      });

      const data = await apiGet(`/api/courses?${params}`);
      setCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiGet('/api/categories');
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [currentPage, searchTerm, categoryFilter]);



  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const uploadedImageUrls = [];
    try {
      for (const file of files) {
        const { timestamp, signature } = await apiGet('/api/cloudinary-signature');
        const cloudFormData = new FormData();
        cloudFormData.append('file', file);
        cloudFormData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
        cloudFormData.append('timestamp', timestamp);
        cloudFormData.append('signature', signature);
        cloudFormData.append('upload_preset', 'casadeele_materials');

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: cloudFormData,
        });
        if (!response.ok) throw new Error('Cloudinary upload failed');
        const data = await response.json();
        uploadedImageUrls.push(data.secure_url);
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImageUrls], imageSource: 'local' }));
    } catch (error) {
      alert(`File upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (formData.images.length === 0) {
        alert('Please upload at least one image.');
        setIsSaving(false);
        return;
      }
      const url = editingCourse ? `/api/courses/${editingCourse._id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';
      const savedCourse = await apiSend(url, method, formData);

      if (editingCourse) {
        setCourses(prev => prev.map(c => (c._id === savedCourse._id ? savedCourse : c)));
      } else {
        setCourses(prev => [savedCourse, ...prev]);
      }
      setShowModal(false);
    } catch (error) {
      alert('Failed to save course.');
    } finally {
      setIsSaving(false);
    }
  };


  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      images: course.images || (course.thumbnail ? [course.thumbnail] : []), // Handle both new and old data
      price: course.price || 0,
      level: course.level || 'beginner',
      language: course.language || 'Spanish',
      instructor: course.instructor || 'CasaDeELE Team',
      modules: course.modules || []
    });
    setShowModal(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await apiSend(`/api/courses/${courseId}`, 'DELETE');
        setCourses(prev => prev.filter(c => c._id !== courseId));
        setSuccessMsg('Course deleted');
        setTimeout(() => setSuccessMsg(''), 2000);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: '', description: '', duration: '', order: formData.modules.length + 1 }]
    });
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeModule = (index) => {
    const updatedModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: updatedModules });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {successMsg ? (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
            {successMsg}
          </div>
        ) : null}
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses Management</h1>
              <p className="text-gray-600">Create and manage your Spanish learning courses</p>
            </div>
            <button
              onClick={() => {
                setEditingCourse(null);
                setFormData({
                  title: '',
                  description: '',
                  category: '',
                  images: [],
                  price: 0,
                  level: 'beginner',
                  language: 'Spanish',
                  instructor: 'CasaDeELE Team',
                  modules: []
                });
                setShowModal(true);
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Add Course
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-green-600">
                  {courses.filter(c => c.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiBookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + (c.price || 0), 0) / courses.length) : 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <button
                onClick={fetchCourses}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FiRefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <FiRefreshCw className="w-6 h-6 text-red-500 animate-spin mr-2" />
              <span className="text-gray-600">Loading courses...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FiBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500">Get started by creating your first course.</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {course.images && course.images.length > 0 ? (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={course.images[0]}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <FiImage className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {course.level}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <FiBookOpen className="w-4 h-4" />
                      {course.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiDollarSign className="w-4 h-4" />
                      ₹{course.price || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            {/* ... Pagination UI ... */}
          </div>
        )}

        {/* Course Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* --- ALL FORM FIELDS --- */}
                {/* Title and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>

                {/* Image Uploader */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                  <div className="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <input type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                    {uploading && <div className="text-sm text-gray-500 mt-2">Uploading...</div>}
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={image} alt="preview" className="h-24 w-full object-cover rounded-md border" />
                          <button type="button" onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))} className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">X</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Price, Level, Language */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <input type="text" value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                  <input type="text" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                {/* Modules */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Course Modules</label>
                    <button type="button" onClick={addModule} className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                      <FiPlus className="w-4 h-4" />
                      Add Module
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.modules.map((module, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-700">Module {index + 1}</h4>
                          <button type="button" onClick={() => removeModule(index)} className="text-red-600 hover:text-red-700">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                            <input type="text" value={module.title} onChange={(e) => updateModule(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                            <input type="text" value={module.duration} onChange={(e) => updateModule(index, 'duration', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g., 30 min" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
                            <input type="number" value={module.order} onChange={(e) => updateModule(index, 'order', parseInt(e.target.value) || index + 1)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                          <textarea value={module.description} onChange={(e) => updateModule(index, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-60">
                    <FiSave className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
                    {isSaving ? 'Saving…' : (editingCourse ? 'Update Course' : 'Create Course')}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;