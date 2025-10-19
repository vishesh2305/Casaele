import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  productType: { type: String, enum: ['Digital', 'Physical', 'Both'], default: 'Digital' }, // Add this line
  description: { type: String, default: '' },
  images: [{ type: String }],
  imageSource: { type: String, enum: ['local', 'pinterest', ''], default: '' },
  stock: { type: Number, default: 0, min: 0 },
}, { timestamps: { createdAt: true, updatedAt: true } })

export default mongoose.models.Product || mongoose.model('Product', productSchema)