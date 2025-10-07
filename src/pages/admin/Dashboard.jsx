import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiShoppingCart, 
  FiDollarSign, 
  FiBox, 
  FiTrendingUp, 
  FiTrendingDown,
  FiClock,
  FiStar,
  FiEye,
  FiRefreshCw,
  FiArrowUpRight,
  FiArrowDownRight,
  FiCalendar,
  FiPackage,
  FiUserPlus
} from 'react-icons/fi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Area, AreaChart } from 'recharts';

// API helper function
function useAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Custom hook for dashboard data
function useDashboardData() {
  const [data, setData] = useState({
    stats: { users: 0, orders: 0, revenue: 0, products: 0 },
    recentOrders: [],
    topProducts: [],
    recentUsers: [],
    salesData: [],
    loading: true,
    error: null
  });

  const headers = useAuthHeaders();

  useEffect(() => {
    fetchDashboardData();
    const id = setInterval(fetchDashboardData, 15000); // poll every 15s
    return () => clearInterval(id);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch all dashboard data in parallel
      const [statsRes, salesRes, ordersRes, productsRes, usersRes] = await Promise.all([
        fetch('/api/dashboard/stats', { headers }).catch(() => ({ ok: false })),
        fetch('/api/dashboard/sales?months=7', { headers }).catch(() => ({ ok: false })),
        fetch('/api/orders?limit=5', { headers }).catch(() => ({ ok: false })),
        fetch('/api/products?limit=5&sort=sales', { headers }).catch(() => ({ ok: false })),
        fetch('/api/users?limit=5&sort=createdAt', { headers }).catch(() => ({ ok: false }))
      ]);

      // Process stats
      let stats = { users: 1248, orders: 312, revenue: 12450, products: 87 };
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        stats = statsData;
      }

      // Process recent orders
      let recentOrders = [];
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        recentOrders = ordersData.slice(0, 5);
      } else {
        // Mock data for demo
        recentOrders = [
          { id: 1, userName: 'Sarah Johnson', amount: 89.99, date: '2024-01-15', status: 'completed' },
          { id: 2, userName: 'Mike Chen', amount: 45.50, date: '2024-01-14', status: 'pending' },
          { id: 3, userName: 'Emma Davis', amount: 120.00, date: '2024-01-14', status: 'completed' },
          { id: 4, userName: 'Alex Rodriguez', amount: 67.25, date: '2024-01-13', status: 'shipped' },
          { id: 5, userName: 'Lisa Wang', amount: 199.99, date: '2024-01-13', status: 'completed' }
        ];
      }

      // Process top products
      let topProducts = [];
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        topProducts = productsData.slice(0, 5);
      } else {
        // Mock data for demo
        topProducts = [
          { id: 1, name: 'Spanish Beginner Course', sales: 45, revenue: 2250 },
          { id: 2, name: 'Grammar Workbook', sales: 32, revenue: 960 },
          { id: 3, name: 'Conversation Practice', sales: 28, revenue: 1400 },
          { id: 4, name: 'Vocabulary Cards', sales: 25, revenue: 500 },
          { id: 5, name: 'Pronunciation Guide', sales: 20, revenue: 800 }
        ];
      }

      // Process recent users
      let recentUsers = [];
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        recentUsers = usersData.slice(0, 5);
      } else {
        // Mock data for demo
        recentUsers = [
          { id: 1, name: 'John Smith', email: 'john@example.com', joinDate: '2024-01-15' },
          { id: 2, name: 'Maria Garcia', email: 'maria@example.com', joinDate: '2024-01-14' },
          { id: 3, name: 'David Lee', email: 'david@example.com', joinDate: '2024-01-14' },
          { id: 4, name: 'Anna Brown', email: 'anna@example.com', joinDate: '2024-01-13' },
          { id: 5, name: 'Tom Wilson', email: 'tom@example.com', joinDate: '2024-01-13' }
        ];
      }

      // Sales data
      let salesData = [];
      if (salesRes.ok) {
        salesData = await salesRes.json();
      } else {
        salesData = [];
      }

      setData({
        stats,
        recentOrders,
        topProducts,
        recentUsers,
        salesData,
        loading: false,
        error: null
      });

    } catch (error) {
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load dashboard data' 
      }));
    }
  };

  return { ...data, refetch: fetchDashboardData };
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, trend, trendValue, color = 'red' }) {
  const colorClasses = {
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
              {trendValue}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Recent Orders Table Component
function RecentOrdersTable({ orders, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {order.userName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{order.userName || 'Unknown User'}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FiCalendar className="w-3 h-3" />
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <span className="font-semibold text-gray-900">${order.amount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Top Products Component
function TopProductsList({ products, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4 p-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product, index) => (
        <div key={product.id} className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
              <p className="text-sm text-gray-500">{product.sales} sales</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">${product.revenue}</p>
            <p className="text-xs text-gray-500">revenue</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Recent Users Component
function RecentUsersList({ users, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4 p-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.id} className="group flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{user.name || 'Unknown User'}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FiCalendar className="w-3 h-3" />
              {new Date(user.joinDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { stats, recentOrders, topProducts, recentUsers, salesData, loading, error, refetch } = useDashboardData();

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats.users.toLocaleString(), 
      icon: FiUsers, 
      trend: 'up', 
      trendValue: '+12%',
      color: 'blue'
    },
    { 
      label: 'Total Orders', 
      value: stats.orders.toLocaleString(), 
      icon: FiShoppingCart, 
      trend: 'up', 
      trendValue: '+8%',
      color: 'green'
    },
    { 
      label: 'Revenue', 
      value: `$${stats.revenue.toLocaleString()}`, 
      icon: FiDollarSign, 
      trend: 'up', 
      trendValue: '+15%',
      color: 'red'
    },
    { 
      label: 'Products', 
      value: stats.products.toLocaleString(), 
      icon: FiBox, 
      trend: 'up', 
      trendValue: '+5%',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/60">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="text-sm font-medium text-red-800">{error}</div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Sales Overview</h2>
                <p className="text-gray-600 text-sm">Monthly revenue and order trends</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <FiTrendingUp className="w-4 h-4" />
                <span className="font-medium">+15% from last month</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <p className="text-gray-600 text-sm">Latest customer purchases</p>
              </div>
              <button className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
                View all
                <FiArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <RecentOrdersTable orders={recentOrders} loading={loading} />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Top Products</h2>
                <p className="text-gray-600 text-sm">Best performing items</p>
              </div>
              <button className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
                View all
                <FiArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <TopProductsList products={topProducts} loading={loading} />
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Latest Users</h2>
                <p className="text-gray-600 text-sm">Newly registered members</p>
              </div>
              <button className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
                View all
                <FiArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <RecentUsersList users={recentUsers} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}


