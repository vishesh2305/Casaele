import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { getAuth, initFirebaseAdmin } from '../config/firebaseAdmin.js'

// GET /api/dashboard/stats
// Returns totals: users, orders, revenue, products
export async function getDashboardStats(req, res) {
  try {
    // Users (Firebase Admin)
    let totalUsers = 0
    try {
      initFirebaseAdmin()
      // listUsers returns up to 1000 per call; loop if needed
      let nextPageToken
      do {
        // eslint-disable-next-line no-await-in-loop
        const result = await getAuth().listUsers(1000, nextPageToken)
        totalUsers += result.users.length
        nextPageToken = result.pageToken
      } while (nextPageToken)
    } catch (e) {
      // Fallback gracefully if Firebase not configured
      totalUsers = 0
    }

    // Orders count and revenue
    const [ordersCount, revenueAgg] = await Promise.all([
      Order.countDocuments({}),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ])
    const totalRevenue = revenueAgg?.[0]?.total || 0

    // Products count
    const productsCount = await Product.countDocuments({})

    return res.json({
      users: totalUsers,
      orders: ordersCount,
      revenue: totalRevenue,
      products: productsCount,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return res.status(500).json({ message: 'Failed to fetch dashboard stats' })
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


