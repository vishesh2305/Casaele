import CmsPage from '../models/CmsPage.js'

export async function createCmsPage(req, res) {
  try {
    const { title, slug, content } = req.body
    if (!title) return res.status(400).json({ message: 'title is required' })
    const page = await CmsPage.create({ title, slug, content })
    res.status(201).json(page)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create CMS page' })
  }
}

export async function getCmsPages(req, res) {
  try {
    const pages = await CmsPage.find().sort({ createdAt: -1 })
    res.json(pages)
  } catch {
    res.status(500).json({ message: 'Failed to list CMS pages' })
  }
}

export async function getCmsPageById(req, res) {
  try {
    const page = await CmsPage.findById(req.params.id)
    if (!page) return res.status(404).json({ message: 'Not found' })
    res.json(page)
  } catch {
    res.status(500).json({ message: 'Failed to fetch CMS page' })
  }
}

export async function getCmsPageBySlug(req, res) {
  try {
    const page = await CmsPage.findOne({ slug: req.params.slug })
    if (!page) return res.status(404).json({ message: 'Not found' })
    res.json(page)
  } catch {
    res.status(500).json({ message: 'Failed to fetch CMS page by slug' })
  }
}

export async function updateCmsPage(req, res) {
  try {
    const { title, slug, content } = req.body
    const updated = await CmsPage.findByIdAndUpdate(
      req.params.id,
      { title, slug, content },
      { new: true, runValidators: true }
    )
    if (!updated) return res.status(404).json({ message: 'Not found' })
    res.json(updated)
  } catch {
    res.status(500).json({ message: 'Failed to update CMS page' })
  }
}

export async function deleteCmsPage(req, res) {
  try {
    const deleted = await CmsPage.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Not found' })
    res.json({ success: true })
  } catch {
    res.status(500).json({ message: 'Failed to delete CMS page' })
  }
}


