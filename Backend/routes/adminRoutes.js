import express from 'express';
import { verifySuperAdmin, verifyAdminAccess } from '../middleware/superAdminAuth.js';
import { 
  createAdmin, 
  verifyAdminOTP, 
  getAllAdmins, 
  getAdminById, 
  deleteAdmin, 
  resendOTP 
} from '../controllers/adminController.js';

const router = express.Router();

// Public route for OTP verification
router.post('/verify', verifyAdminOTP);

// Super admin only routes
router.post('/create', verifySuperAdmin, createAdmin);
router.get('/', verifySuperAdmin, getAllAdmins);
router.get('/:id', verifySuperAdmin, getAdminById);
router.delete('/:id', verifySuperAdmin, deleteAdmin);
router.post('/resend-otp', verifySuperAdmin, resendOTP);

export default router;
