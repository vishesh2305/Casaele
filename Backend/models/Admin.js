import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  role: { 
    type: String, 
    default: 'admin',
    enum: ['admin', 'super-admin']
  },
  otp: { 
    type: String,
    default: null
  },
  otpExpiresAt: { 
    type: Date,
    default: null
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Pre-save middleware to update updatedAt
adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual to check if OTP is expired
adminSchema.virtual('isOtpExpired').get(function() {
  if (!this.otp || !this.otpExpiresAt) return true;
  return new Date() > this.otpExpiresAt;
});

// Virtual to check if admin can login
adminSchema.virtual('canLogin').get(function() {
  return this.verified && this.role === 'admin';
});

// Method to generate OTP
adminSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

// Method to verify OTP
adminSchema.methods.verifyOTP = function(inputOtp) {
  if (!this.otp || this.isOtpExpired) {
    return { success: false, message: 'OTP has expired' };
  }
  if (this.otp !== inputOtp) {
    return { success: false, message: 'Invalid OTP' };
  }
  this.verified = true;
  this.otp = null;
  this.otpExpiresAt = null;
  return { success: true, message: 'OTP verified successfully' };
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
