import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { getBanners, getBannerById, createBanner, updateBanner, deleteBanner, toggleBannerStatus } from '../controllers/bannerController.js';

const router = express.Router();

router.route('/')
  .get(verifyFirebaseToken, getBanners)
  .post(verifyFirebaseToken, createBanner);

router.route('/:id')
  .get(verifyFirebaseToken, getBannerById)
  .put(verifyFirebaseToken, updateBanner)
  .delete(verifyFirebaseToken, deleteBanner);

router.put('/:id/toggle', verifyFirebaseToken, toggleBannerStatus);

export default router;
