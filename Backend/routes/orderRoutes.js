import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { getOrders, getOrderById, updateOrder, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
  .get(verifyFirebaseToken, getOrders);

router.route('/:id')
  .get(verifyFirebaseToken, getOrderById)
  .put(verifyFirebaseToken, updateOrder)
  .delete(verifyFirebaseToken, deleteOrder);

export default router;
