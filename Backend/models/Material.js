import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  category: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
}, { timestamps: { createdAt: true, updatedAt: true } })

export default mongoose.models.Material || mongoose.model('Material', materialSchema)


