import { Router } from 'express'
import Material from '../models/Material.js'
import { verifyFirebaseToken } from '../middleware/auth.js'

const router = Router()

// Create
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { title, content, category, fileUrl } = req.body
    if (!title) return res.status(400).json({ message: 'title is required' })
    const material = await Material.create({ title, content, category, fileUrl })
    res.status(201).json(material)
  } catch (e) {
    res.status(500).json({ message: 'Failed to create material' })
  }
})

// Read all
router.get('/', verifyFirebaseToken, async (req, res) => {
  const items = await Material.find().sort({ createdAt: -1 })
  res.json(items)
})

// Read one
router.get('/:id', verifyFirebaseToken, async (req, res) => {
  const item = await Material.findById(req.params.id)
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
})

// Update
router.put('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { title, content, category, fileUrl } = req.body
    const updated = await Material.findByIdAndUpdate(
      req.params.id,
      { title, content, category, fileUrl },
      { new: true, runValidators: true }
    )
    if (!updated) return res.status(404).json({ message: 'Not found' })
    res.json(updated)
  } catch (e) {
    res.status(500).json({ message: 'Failed to update material' })
  }
})

// Delete
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  const deleted = await Material.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Not found' })
  res.json({ success: true })
})

export default router


