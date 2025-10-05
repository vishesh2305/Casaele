import mongoose from 'mongoose'

const EmbedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['AI', 'H5P'] },
    embedCode: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Embed', EmbedSchema)


