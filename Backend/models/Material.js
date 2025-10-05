import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: {type: String, default: ''},
  content: { type: String, default: '' },
  tags: [{type: String}],
  category: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
}, { timestamps: { createdAt: true, updatedAt: true } })

export default mongoose.models.Material || mongoose.model('Material', materialSchema)