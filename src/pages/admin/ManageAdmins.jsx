import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiRefreshCw,
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTrash2,
  FiUser,
  FiShield,
  FiAlertCircle,
  FiSend,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { verified: statusFilter })
      });

      const response = await fetch(`/api/admins?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
        setTotalPages(data.totalPages || 1);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to fetch admins' });
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setMessage({ type: 'error', text: 'Failed to fetch admins' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [currentPage, searchTerm, statusFilter]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }

    setIsCreating(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admins/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setShowCreateModal(false);
        setFormData({ email: '', otp: '' });
        fetchAdmins();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setMessage({ type: 'error', text: 'Failed to create admin' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp.trim()) {
      setMessage({ type: 'error', text: 'OTP is required' });
      return;
    }

    setIsVerifying(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/admins/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: selectedAdmin.email, 
          otp: formData.otp.trim() 
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setShowVerifyModal(false);
        setFormData({ email: '', otp: '' });
        setSelectedAdmin(null);
        fetchAdmins();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage({ type: 'error', text: 'Failed to verify OTP' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async (admin) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admins/resend-otp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: admin.email })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'OTP sent successfully' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setMessage({ type: 'error', text: 'Failed to resend OTP' });
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/admins/${adminId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          fetchAdmins();
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } catch (error) {
        console.error('Error deleting admin:', error);
        setMessage({ type: 'error', text: 'Failed to delete admin' });
      }
    }
  };

  const openVerifyModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({ email: admin.email, otp: '' });
    setShowVerifyModal(true);
  };

  const getStatusIcon = (admin) => {
    if (admin.verified) {
      return <FiCheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <FiClock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusText = (admin) => {
    if (admin.verified) {
      return 'Verified';
    }
    return 'Pending';
  };

  const getStatusColor = (admin) => {
    if (admin.verified) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const getRoleIcon = (admin) => {
    if (admin.role === 'super-admin') {
      return <FiShield className="w-4 h-4 text-purple-500" />;
    }
    return <FiUser className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Admins</h1>
              <p className="text-gray-600">Create and manage admin accounts with OTP verification</p>
            </div>
            <button
              onClick={() => {
                setFormData({ email: '', otp: '' });
                setShowCreateModal(true);
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Create Admin
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <FiCheckCircle className="w-5 h-5" />
              ) : (
                <FiAlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Admins</p>
                <p className="text-2xl font-bold text-green-600">
                  {admins.filter(a => a.verified).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {admins.filter(a => !a.verified).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Super Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {admins.filter(a => a.role === 'super-admin').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiShield className="w-6 h-6 text-purple-600" />
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
                  placeholder="Search admins by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="true">Verified</option>
                <option value="false">Pending</option>
              </select>
              <button
                onClick={fetchAdmins}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FiRefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FiRefreshCw className="w-6 h-6 text-red-500 animate-spin mr-2" />
              <span className="text-gray-600">Loading admins...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg mr-3">
                              <FiMail className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{admin.email}</div>
                              {admin.createdBy && (
                                <div className="text-sm text-gray-500">Created by: {admin.createdBy.email}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(admin)}
                            <span className="text-sm text-gray-900 capitalize">{admin.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(admin)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(admin)}`}>
                              {getStatusText(admin)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {!admin.verified && (
                              <>
                                <button
                                  onClick={() => openVerifyModal(admin)}
                                  className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                                  title="Verify OTP"
                                >
                                  <FiCheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleResendOTP(admin)}
                                  className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50"
                                  title="Resend OTP"
                                >
                                  <FiSend className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {admin.role !== 'super-admin' && (
                              <button
                                onClick={() => handleDeleteAdmin(admin._id)}
                                className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                                title="Delete Admin"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Page <span className="font-medium">{currentPage}</span> of{' '}
                          <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Create Admin Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Create New Admin</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreateAdmin} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isCreating ? (
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiPlus className="w-4 h-4" />
                    )}
                    {isCreating ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Verify OTP Modal */}
        {showVerifyModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Verify Admin OTP</h3>
                  <button
                    onClick={() => setShowVerifyModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleVerifyOTP} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedAdmin.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code *</label>
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                    placeholder="123456"
                    maxLength="6"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code sent to {selectedAdmin.email}</p>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowVerifyModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isVerifying ? (
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiCheckCircle className="w-4 h-4" />
                    )}
                    {isVerifying ? 'Verifying...' : 'Verify OTP'}
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

export default ManageAdmins;
