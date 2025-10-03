import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import healthRoutes from './routes/healthRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import dummyApi from './routes/dummyApi.js'
import Razorpay from 'razorpay'
import Stripe from 'stripe'

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

app.use(cors())
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


// Razorpay
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAYSECRETKEY,
});
app.post('/create-razorpay-order', async (req, res) => {
    const { amount, currency } = req.body;
    const options = {
        amount: amount,
        currency: currency,
        receipt: 'receipt_order_74394',
    };
    try {
        const order = await instance.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Stripe
const stripe = new Stripe(process.env.STRIPESECRETKEY);

app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






app.use('/', healthRoutes)
app.use('/api/users', userRoutes)
app.use('/api', dummyApi)

// 404 + Error handlers
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


