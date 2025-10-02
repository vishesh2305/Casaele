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

dotenv.config()

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
})

app.use(cors())
app.use(express.json())
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

// 404 + Error handlers
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


