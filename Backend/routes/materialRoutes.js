import { Router } from 'express'
import Material from '../models/Material.js'
import { verifyFirebaseToken } from '../middleware/auth.js'

const router = Router()

// Create (admin)
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { title, content, category, fileUrl, imageSource, description, tags, embedIds, embeds } = req.body
    if (!title) return res.status(400).json({ message: 'title is required' })
    
    let finalEmbedIds = embedIds || []
    
    // Handle direct embed creation (new feature)
    if (embeds && Array.isArray(embeds) && embeds.length > 0) {
      const Embed = (await import('../models/Embed.js')).default
      const createdEmbeds = []
      
      for (const embedData of embeds) {
        if (embedData.title && embedData.type && embedData.embedCode) {
          const embed = await Embed.create({
            title: embedData.title,
            type: embedData.type,
            embedCode: embedData.embedCode
          })
          createdEmbeds.push(embed._id)
        }
      }
      
      finalEmbedIds = [...finalEmbedIds, ...createdEmbeds]
    }
    
    const material = await Material.create({ 
      title, 
      content: content || '', 
      description: description || '',
      category: category || '', 
      fileUrl: fileUrl || '', 
      imageSource: imageSource || '',
      tags: Array.isArray(tags) ? tags : [],
      embedIds: finalEmbedIds
    }).then(doc => doc.populate('embedIds'))
    res.status(201).json(material)
  } catch (e) {
    console.error('Error creating material:', e)
    res.status(500).json({ message: 'Failed to create material' })
  }
})

// Read all (public)
router.get('/', async (req, res) => {
  const items = await Material.find().populate('embedIds').sort({ createdAt: -1 })
  res.json(items)
})

// Read one (public)
router.get('/:id', async (req, res) => {
  const item = await Material.findById(req.params.id).populate('embedIds')
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
})

// Update (admin)
router.put('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { title, content, category, fileUrl, embedIds, embeds, description, tags, imageSource } = req.body
    
    let finalEmbedIds = embedIds || []
    
    // Handle direct embed creation (new feature)
    if (embeds && Array.isArray(embeds) && embeds.length > 0) {
      const Embed = (await import('../models/Embed.js')).default
      const createdEmbeds = []
      
      for (const embedData of embeds) {
        if (embedData.title && embedData.type && embedData.embedCode) {
          const embed = await Embed.create({
            title: embedData.title,
            type: embedData.type,
            embedCode: embedData.embedCode
          })
          createdEmbeds.push(embed._id)
        }
      }
      
      finalEmbedIds = [...finalEmbedIds, ...createdEmbeds]
    }
    
    const updated = await Material.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        content, 
        category, 
        fileUrl, 
        embedIds: finalEmbedIds, 
        description,
        tags: Array.isArray(tags) ? tags : [],
        imageSource
      },
      { new: true, runValidators: true }
    ).populate('embedIds')
    if (!updated) return res.status(404).json({ message: 'Not found' })
    res.json(updated)
  } catch (e) {
    console.error('Error updating material:', e)
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