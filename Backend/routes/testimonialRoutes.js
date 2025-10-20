import express from 'express'
import Testimonial from '../models/Testimonial.js'
import { verifyAdminAccess } from '../middleware/superAdminAuth.js'

const router = express.Router()

// Public: submit testimonial
router.post('/add', async (req, res) => {
  try {
    let { name, message, rating } = req.body
    if (!name || !message) return res.status(400).json({ message: 'name and message are required' })
    // Normalize rating to decimal (0-5), optional
    if (rating !== undefined && rating !== null && rating !== '') {
      const parsed = Number(rating)
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 5) {
        return res.status(400).json({ message: 'rating must be a number between 0 and 5' })
      }
      rating = parsed
    } else {
      rating = undefined
    }
    const created = await Testimonial.create({ name, message, rating, status: 'pending' })
    res.status(201).json(created)
  } catch (e) {
    console.error('Testimonial submit error:', e?.message || e)
    res.status(500).json({ message: 'Failed to submit testimonial' })
  }
})

// Public: fetch approved testimonials (for frontend)
router.get('/approved', async (req, res) => {
  const items = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 })
  res.json(items)
})

// Admin: get all
router.get('/', verifyAdminAccess, async (req, res) => {
  const items = await Testimonial.find().sort({ createdAt: -1 })
  res.json(items)
})

// Admin: approve
router.put('/approve/:id', verifyAdminAccess, async (req, res) => {
  const updated = await Testimonial.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true })
  if (!updated) return res.status(404).json({ message: 'Not found' })
  res.json(updated)
})

// Admin: reject
router.put('/reject/:id', verifyAdminAccess, async (req, res) => {
  const updated = await Testimonial.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true })
  if (!updated) return res.status(404).json({ message: 'Not found' })
  res.json(updated)
})

// Admin: delete
router.delete('/:id', verifyAdminAccess, async (req, res) => {
  const deleted = await Testimonial.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Not found' })
  res.json({ success: true })
})

export default router


