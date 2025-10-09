import { Router } from 'express'
import Product from '../models/Product.js'
import { verifyFirebaseToken } from '../middleware/auth.js'

const router = Router()

// Create (admin)
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { name, price, description, image, stock } = req.body
    if (!name || price == null) return res.status(400).json({ message: 'name and price are required' })
    const product = await Product.create({ name, price, description, image, stock })
    res.status(201).json(product)
  } catch (e) {
    res.status(500).json({ message: 'Failed to create product' })
  }
})

// Read all (public)
router.get('/', async (req, res) => {
  const items = await Product.find().sort({ createdAt: -1 })
  res.json(items)
})

// Read one (public)
router.get('/:id', async (req, res) => {
  const item = await Product.findById(req.params.id)
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
})

// Update (admin)
router.put('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { name, price, description, image, stock } = req.body
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, image, stock },
      { new: true, runValidators: true }
    )
    if (!updated) return res.status(404).json({ message: 'Not found' })
    res.json(updated)
  } catch (e) {
    res.status(500).json({ message: 'Failed to update product' })
  }
})

// Delete (admin)
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Not found' })
  res.json({ success: true })
})

export default router


