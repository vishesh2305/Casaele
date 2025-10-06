import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String }, // Cloudinary URL
  modules: [{ 
    title: String, 
    description: String, 
    duration: String,
    order: Number 
  }],
  price: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  instructor: { type: String, default: 'CasaDeELE Team' },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  language: { type: String, default: 'Spanish' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
