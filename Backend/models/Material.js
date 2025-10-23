// Backend/models/Material.js
import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  content: { type: String, default: '' },
  tags: [{ type: String }],
  category: { type: String, default: '' },
  fileUrl: { type: String, default: '' }, // Main image/file for the card
  bannerImageUrl: { type: String, default: '' }, // *** NEW: Image for banner display ***
  displayType: { type: String, enum: ['simple', 'banner'], default: 'simple' }, // *** NEW: Type ***
  imageSource: { type: String, enum: ['local', 'pinterest', ''], default: '' },
  embedIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Embed' }],
}, { timestamps: { createdAt: true, updatedAt: true } }); // *** Ensure timestamps are enabled ***

export default mongoose.models.Material || mongoose.model('Material', materialSchema);