import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: {type: String, default: ''},
  content: { type: String, default: '' },
  tags: [{type: String}],
  category: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  imageSource: { type: String, enum: ['local', 'pinterest', ''], default: '' },
  embedIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Embed' }], // Array of embed references
  // Removed embedType as each embed now has its own type
}, { timestamps: { createdAt: true, updatedAt: true } })

export default mongoose.models.Material || mongoose.model('Material', materialSchema)