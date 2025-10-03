import mongoose from 'mongoose'

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const cmsPageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    content: { type: String, default: '' },
  },
  { timestamps: true }
)

cmsPageSchema.pre('validate', function (next) {
  if (!this.slug && this.title) this.slug = slugify(this.title)
  next()
})

export default mongoose.models.CmsPage || mongoose.model('CmsPage', cmsPageSchema)


