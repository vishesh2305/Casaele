import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  imageSource: { type: String, enum: ['local', 'pinterest', ''], default: '' },
  stock: { type: Number, default: 0, min: 0 },
}, { timestamps: { createdAt: true, updatedAt: true } })

export default mongoose.models.Product || mongoose.model('Product', productSchema)


