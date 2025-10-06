import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercentage: { type: Number, required: true, min: 1, max: 100 },
  discountAmount: { type: Number, min: 0 }, // Fixed amount discount
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number }, // Maximum discount cap
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  usageLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

couponSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual to check if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return new Date() > this.validTo;
});

// Virtual to check if coupon is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         now >= this.validFrom && 
         now <= this.validTo && 
         this.usedCount < this.usageLimit;
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
