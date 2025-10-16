import { Router } from 'express'
import Material from '../models/Material.js'
import { verifyFirebaseToken } from '../middleware/auth.js'

const router = Router()

// Create (admin)
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { title, content, category, fileUrl, imageSource, description, tags, embedId, embedType } = req.body
    if (!title) return res.status(400).json({ message: 'title is required' })
    const material = await Material.create({ 
      title, 
      content: content || '', 
      description: description || '',
      category: category || '', 
      fileUrl: fileUrl || '', 
      imageSource: imageSource || '',
      tags: Array.isArray(tags) ? tags : [],
      embedId: embedId || null,
      embedType: embedType || ''
    }).then(doc => doc.populate('embedId'))
    res.status(201).json(material)
  } catch (e) {
    res.status(500).json({ message: 'Failed to create material' })
  }
})

// Read all (public)
router.get('/', async (req, res) => {
  const items = await Material.find().populate('embedId').sort({ createdAt: -1 })
  res.json(items)
})

// Read one (public)
router.get('/:id', async (req, res) => {
  const item = await Material.findById(req.params.id).populate('embedId')
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
})

// Update (admin)
router.put('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { title, content, category, fileUrl, embedId, embedType } = req.body
    const updated = await Material.findByIdAndUpdate(
      req.params.id,
      { title, content, category, fileUrl, embedId, embedType },
      { new: true, runValidators: true }
    ).populate('embedId')
    if (!updated) return res.status(404).json({ message: 'Not found' })
    res.json(updated)
  } catch (e) {
    res.status(500).json({ message: 'Failed to update material' })
  }
})

// Delete (admin)
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  const deleted = await Material.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Not found' })
  res.json({ success: true })
})

export default router


