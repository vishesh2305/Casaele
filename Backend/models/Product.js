import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  category: { type: String, required: true },
  
  // --- CHANGE ---
  // We are replacing the old 'imageUrl' string
  // with an array of strings called 'imageUrls'
  imageUrls: [{ type: String }],
  // --- END CHANGE ---

  availableLevels: [{ type: String }], // Array of available levels like ['A1', 'B2']
  productType: { type: String, enum: ['Digital', 'Physical', 'Both'], default: 'Digital' },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);