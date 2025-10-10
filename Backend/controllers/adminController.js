import Admin from '../models/Admin.js';
import { sendEmail, emailTemplates } from '../config/nodemailer.js';

// @route   POST /api/admins/create
// @desc    Create new admin and send OTP
// @access  Super Admin only
export async function createAdmin(req, res) {
  try {
    const { email } = req.body;
    const createdBy = req.user.uid; // From Firebase auth

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      if (existingAdmin.verified) {
        return res.status(400).json({ 
          success: false, 
          message: 'Admin with this email already exists and is verified' 
        });
      } else {
        // Resend OTP for unverified admin
        const otp = existingAdmin.generateOTP();
        await existingAdmin.save();

        // Send OTP email
        const emailResult = await sendEmail(emailTemplates.adminOTP(email, otp));
        
        if (!emailResult.success) {
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to send OTP email' 
          });
        }

        return res.status(200).json({ 
          success: true, 
          message: 'OTP sent successfully to existing unverified admin',
          adminId: existingAdmin._id
        });
      }
    }

    // Create new admin
    const newAdmin = new Admin({
      email: email.toLowerCase(),
      createdBy: createdBy
    });

    // Generate OTP
    const otp = newAdmin.generateOTP();
    await newAdmin.save();

    // Send OTP email
    const emailResult = await sendEmail(emailTemplates.adminOTP(email, otp));
    
    if (!emailResult.success) {
      // If email fails, delete the admin record
      await Admin.findByIdAndDelete(newAdmin._id);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP email' 
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Admin created successfully. OTP sent to email.',
      adminId: newAdmin._id
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
}

// @route   POST /api/admins/verify
// @desc    Verify admin OTP
// @access  Public (for OTP verification)
export async function verifyAdminOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    // Verify OTP
    const verificationResult = admin.verifyOTP(otp);
    
    if (!verificationResult.success) {
      return res.status(400).json({ 
        success: false, 
        message: verificationResult.message 
      });
    }

    await admin.save();

    res.status(200).json({ 
      success: true, 
      message: verificationResult.message,
      admin: {
        id: admin._id,
        email: admin.email,
        verified: admin.verified,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Error verifying admin OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
}

// @route   GET /api/admins
// @desc    Get all admins
// @access  Super Admin only
export async function getAllAdmins(req, res) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      verified,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (verified !== undefined) query.verified = verified === 'true';
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const admins = await Admin.find(query)
      .populate('createdBy', 'email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-otp -otpExpiresAt'); // Exclude sensitive data

    const total = await Admin.countDocuments(query);

    res.status(200).json({
      success: true,
      admins,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
}

// @route   GET /api/admins/:id
// @desc    Get single admin
// @access  Super Admin only
export async function getAdminById(req, res) {
  try {
    const admin = await Admin.findById(req.params.id)
      .populate('createdBy', 'email')
      .select('-otp -otpExpiresAt');

    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      admin 
    });

  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
}

// @route   DELETE /api/admins/:id
// @desc    Delete admin
// @access  Super Admin only
export async function deleteAdmin(req, res) {
  try {
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    // Prevent deletion of super-admin
    if (admin.role === 'super-admin') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete super-admin' 
      });
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      success: true, 
      message: 'Admin deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
}

// @route   POST /api/admins/resend-otp
// @desc    Resend OTP to unverified admin
// @access  Super Admin only
export async function resendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    if (admin.verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin is already verified' 
      });
    }

    // Generate new OTP
    const otp = admin.generateOTP();
    await admin.save();

    // Send OTP email
    const emailResult = await sendEmail(emailTemplates.adminOTP(email, otp));
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP email' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully' 
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
}
