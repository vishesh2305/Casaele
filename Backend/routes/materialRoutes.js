import { Router } from 'express'
import Material from '../models/Material.js'
import { verifyFirebaseToken } from '../middleware/auth.js'

const router = Router()

// Create (admin)
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    // 'content' and 'displayType' have been removed.
    const { title, category, fileUrl, imageSource, description, tags, embedIds, embeds, bannerImageUrl } = req.body
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
      description: description || '',
      category: category || '', 
      fileUrl: fileUrl || '', 
      imageSource: imageSource || '',
      tags: Array.isArray(tags) ? tags : [],
      embedIds: finalEmbedIds,
      bannerImageUrl: bannerImageUrl || '' // Added bannerImageUrl
    }).then(doc => doc.populate('embedIds'))
    
    res.status(201).json(material)
  } catch (e) {
    console.error('Error creating material:', e)
    res.status(500).json({ message: 'Failed to create material' })
  }
})

// Read all (public)
// No changes needed
router.get('/', async (req, res) => {
  const items = await Material.find().populate('embedIds').sort({ createdAt: -1 })
  res.json(items)
})

// Read one (public)
// No changes needed
router.get('/:id', async (req, res) => {
  const item = await Material.findById(req.params.id).populate('embedIds')
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
})

// Update (admin)
router.put('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    // 'content' and 'displayType' have been removed.
    const { title, category, fileUrl, embedIds, embeds, description, tags, imageSource, bannerImageUrl } = req.body
    
    let finalEmbedIds = embedIds || []
    
    // Handle direct embed creation
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
    
    // updateData object without 'content'
    const updateData = { 
      title, 
      category, 
      fileUrl, 
      embedIds: finalEmbedIds, 
      description,
      tags: Array.isArray(tags) ? tags : [],
      imageSource,
      bannerImageUrl // Added bannerImageUrl
    }

    const updated = await Material.findByIdAndUpdate(
      req.params.id,
      updateData, // Use the updateData object
      { new: true, runValidators: true }
    ).populate('embedIds')
    
    if (!updated) return res.status(404).json({ message: 'Not found' })
    res.json(updated)
  } catch (e) {
    console.error('Error updating material:', e)
    res.status(500).json({ message: 'Failed to update. ' + e.message })
  }
})

// Delete (admin)
// No changes needed
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  const deleted = await Material.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Not found' })
  res.json({ success: true })
})

export default router;