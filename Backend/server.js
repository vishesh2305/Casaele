import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import healthRoutes from './routes/healthRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import dummyApi from './routes/dummyApi.js'
import productRoutes from './routes/productRoutes.js'
import materialCrudRoutes from './routes/materialRoutes.js'
import materialsRoutes from './routes/materials.js'
import debugRoutes from './routes/debug.js'
import cmsRoutes from './routes/cmsRoutes.js'
import formRoutes from './routes/formRoutes.js'
import embedRoutes from './routes/embedRoutes.js'
import pinterestRoutes from './routes/pinterestRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import bannerRoutes from './routes/bannerRoutes.js'
import couponRoutes from './routes/couponRoutes.js'
import subscriberRoutes from './routes/subscriberRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import Razorpay from 'razorpay'
import Stripe from 'stripe'
import { v2 as cloudinary } from 'cloudinary';

dotenv.config()

// Connect to Cloudinary
cloudinary.config(
  {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  }
)


// Connect to MongoDB
let isDbConnected = false
const dbConn = await connectDB()
if (dbConn) {
  isDbConnected = true
  try {
    const db = mongoose.connection.useDb('amritDB')
    const result = await db.collection('test').insertOne({ name: 'Natansh', status: 'connected' })
    console.log('Dummy document inserted into amritDB.test:', result.insertedId)
  } catch (err) {
    console.error('Failed to insert dummy document into amritDB.test:', err.message)
  }
} else {
  console.warn('Skipping dummy insert because DB is not connected')
}

const app = express()
app.set('isDbConnected', isDbConnected)

// CORS configuration
const allowedOrigins = [
  'https://amrit-project-lms-fnao-git-master-visheshs-projects-48678073.vercel.app/', // Replace with your Vercel URL
  'http://localhost:3000',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json())

// Keep isDbConnected in sync with Mongoose connection events
mongoose.connection.on('connected', () => {
  app.set('isDbConnected', true)
  console.log('Mongoose event: connected')
})
mongoose.connection.on('disconnected', () => {
  app.set('isDbConnected', false)
  console.warn('Mongoose event: disconnected')
})
mongoose.connection.on('error', (err) => {
  app.set('isDbConnected', false)
  console.error('Mongoose event: error', err?.message || err)
});

// Payment Gateway

// Razorpay (optional)
const hasRazorpayKeys =
  !!process.env.RAZORPAY_KEY_ID && !!(process.env.RAZORPAYSECRETKEY || process.env.RAZORPAY_KEY_SECRET)

let razorpayInstance = null
if (hasRazorpayKeys) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAYSECRETKEY || process.env.RAZORPAY_KEY_SECRET,
    })
    console.log('Razorpay initialized')
  } catch (err) {
    console.warn('Failed to initialize Razorpay:', err?.message || err)
  }
} else {
  console.warn('Razorpay keys missing - Razorpay routes will be disabled')
}

app.post('/create-razorpay-order', async (req, res) => {
  if (!razorpayInstance) {
    return res.status(503).json({ message: 'Razorpay not configured' })
  }
  const { amount, currency } = req.body
  const options = {
    amount: amount,
    currency: currency,
    receipt: 'receipt_order_74394',
  }
  try {
    const order = await razorpayInstance.orders.create(options)
    res.json(order)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Stripe (optional)
const stripeSecret = process.env.STRIPESECRETKEY || process.env.STRIPE_SECRET_KEY
let stripe = null
if (stripeSecret) {
  try {
    stripe = new Stripe(stripeSecret)
    console.log('Stripe initialized')
  } catch (err) {
    console.warn('Failed to initialize Stripe:', err?.message || err)
  }
} else {
  console.warn('Stripe key missing - Stripe routes will be disabled')
}

app.post('/create-payment-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ message: 'Stripe not configured' })
  }
  const { amount, currency } = req.body
  try {
    const paymentIntent = await stripe.paymentIntents.create({ amount, currency })
    res.send({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/cloudinary-signature', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      upload_preset: 'casadeele_materials'
    },
    process.env.CLOUDINARY_API_SECRET
  );
  res.json({ timestamp, signature });
});

// Disable caching for API responses (useful for admin)
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use('/', healthRoutes)
app.use('/api/users', userRoutes)
app.use('/api', dummyApi)
app.use('/api/products', productRoutes)
app.use('/api/materials', materialCrudRoutes)
app.use('/api/debug', debugRoutes)
app.use('/api/cms', cmsRoutes)
app.use('/api/forms', formRoutes)
app.use('/api/embeds', embedRoutes)
app.use('/api/pinterest', pinterestRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/subscribers', subscriberRoutes)
app.use('/api/admins', adminRoutes)

// 404 + Error handlers
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})