import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Material from '../models/Material.js'
import Course from '../models/Course.js'
import User from '../models/User.js'
import { getAuth, initFirebaseAdmin } from '../config/firebaseAdmin.js'

// GET /api/dashboard/stats
// Returns totals: users, orders, revenue, products
export async function getDashboardStats(req, res) {
  try {
    // Users (Firebase Admin)
    let totalUsers = 0;
    try {
      console.log("Attempting to initialize Firebase Admin...");
      initFirebaseAdmin();
      console.log("Firebase Admin initialized. Listing users...");
      // listUsers returns up to 1000 per call; loop if needed
      let nextPageToken;
      do {
        // eslint-disable-next-line no-await-in-loop
        const result = await getAuth().listUsers(1000, nextPageToken);
        totalUsers += result.users.length;
        nextPageToken = result.pageToken;
      } while (nextPageToken);
      console.log("Successfully listed users from Firebase.");
    } catch (e) {
      console.error("Firebase Admin user listing failed. Falling back to local DB.", e);
      // Fallback gracefully if Firebase Admin is not configured: use local User collection
      try {
        totalUsers = await User.countDocuments({});
        console.log("Successfully counted users from local DB.");
      } catch (dbError) {
        console.error("Local DB user count failed.", dbError);
        totalUsers = 0;
      }
    }

    // ... rest of the function ...
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
}

// GET /api/dashboard/sales?months=6
// Returns monthly sales summary for the chart
export async function getSalesOverview(req, res) {
  try {
    const months = Math.max(1, Math.min(24, Number(req.query.months) || 6))

    // Start date months ago, beginning of that month
    const start = new Date()
    start.setUTCDate(1)
    start.setUTCHours(0, 0, 0, 0)
    start.setUTCMonth(start.getUTCMonth() - (months - 1))

    const agg = await Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          sales: { $sum: '$amount' },
          orders: { $sum: 1 },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    // Build a continuous timeline array for the requested window
    const out = []
    const cursor = new Date(start)
    for (let i = 0; i < months; i += 1) {
      const year = cursor.getUTCFullYear()
      const month = cursor.getUTCMonth() + 1
      const key = `${year}-${month}`
      const match = agg.find(a => a._id.year === year && a._id.month === month)
      const name = cursor.toLocaleString('default', { month: 'short' })
      out.push({ name, year, month, sales: match ? match.sales : 0, orders: match ? match.orders : 0 })
      cursor.setUTCMonth(cursor.getUTCMonth() + 1)
    }

    return res.json(out)
  } catch (error) {
    console.error('Dashboard sales error:', error)
    return res.status(500).json({ message: 'Failed to fetch sales overview' })
  }
}

// GET /api/dashboard/recent
// Returns latest 5 activities across key collections
export async function getRecentActivity(req, res) {
  try {
    const [recentOrders, recentProducts, recentMaterials, recentCourses, recentUsers] = await Promise.all([
      Order.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Product.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Material.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Course.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      User.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ])

    const normalize = (items, type, titleKey = 'title', amountKey) =>
      items.map(i => ({
        id: i._id?.toString(),
        type,
        title: i[titleKey] || i.name || i.email || type,
        amount: amountKey ? i[amountKey] : undefined,
        createdAt: i.createdAt || new Date(),
      }))

    const combined = [
      ...normalize(recentCourses, 'course', 'title'),
      ...normalize(recentMaterials, 'material', 'title'),
      ...normalize(recentProducts, 'product', 'name'),
      ...normalize(recentOrders, 'order', 'id', 'amount'),
      ...normalize(recentUsers, 'user', 'name'),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    return res.json(combined)
  } catch (error) {
    console.error('Dashboard recent error:', error)
    return res.status(500).json({ message: 'Failed to fetch recent activity' })
  }
}


