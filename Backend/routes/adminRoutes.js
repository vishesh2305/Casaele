import express from 'express';
import { verifySuperAdmin } from '../middleware/superAdminAuth.js';
import { verifyVerifiedAdmin } from '../middleware/auth.js';
import { 
  createAdmin, 
  getAllAdmins, 
  deleteAdmin} from '../controllers/adminController.js';

const router = express.Router();

router.get('/check-status', verifyVerifiedAdmin, (req, res) => {
  res.status(200).json({ success: true, message: 'Admin verified.' });
});

// Super admin only routes
router.post('/create', verifySuperAdmin, createAdmin);
router.get('/', verifySuperAdmin, getAllAdmins);
router.delete('/:id', verifySuperAdmin, deleteAdmin);



export default router;
