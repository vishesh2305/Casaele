import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: {type: String, default: ''},
  content: { type: String, default: '' },
  tags: [{type: String}],
  category: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  imageSource: { type: String, enum: ['local', 'pinterest', ''], default: '' },
  embedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Embed' },
  embedType: { type: String, enum: ['H5P', 'AI', ''], default: '' },
}, { timestamps: { createdAt: true, updatedAt: true } })

export default mongoose.models.Material || mongoose.model('Material', materialSchema)