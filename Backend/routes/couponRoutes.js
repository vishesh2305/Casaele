import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { getCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } from '../controllers/couponController.js';

const router = express.Router();

router.route('/')
  .get(verifyFirebaseToken, getCoupons)
  .post(verifyFirebaseToken, createCoupon);

router.route('/:id')
  .get(verifyFirebaseToken, getCouponById)
  .put(verifyFirebaseToken, updateCoupon)
  .delete(verifyFirebaseToken, deleteCoupon);

router.put('/:id/toggle', verifyFirebaseToken, toggleCouponStatus);

export default router;
