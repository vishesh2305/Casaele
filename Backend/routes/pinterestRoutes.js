import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { 
  fetchPinterestInfo, 
  savePinterestData, 
  getPinterestData, 
  updatePinterestData, 
  deletePinterestData 
} from '../controllers/pinterestController.js';

const router = express.Router();

// All routes protected by Firebase authentication (admin only)
router.post('/fetch', verifyFirebaseToken, fetchPinterestInfo);
router.post('/save', verifyFirebaseToken, savePinterestData);
router.get('/', verifyFirebaseToken, getPinterestData);
router.put('/:id', verifyFirebaseToken, updatePinterestData);
router.delete('/:id', verifyFirebaseToken, deletePinterestData);

export default router;
