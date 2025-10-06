import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.route('/')
  .get(verifyFirebaseToken, getCategories)
  .post(verifyFirebaseToken, createCategory);

router.route('/:id')
  .get(verifyFirebaseToken, getCategoryById)
  .put(verifyFirebaseToken, updateCategory)
  .delete(verifyFirebaseToken, deleteCategory);

export default router;
