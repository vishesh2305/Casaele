import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';

const router = express.Router();

router.route('/')
  .get(verifyFirebaseToken, getCourses)
  .post(verifyFirebaseToken, createCourse);

router.route('/:id')
  .get(verifyFirebaseToken, getCourseById)
  .put(verifyFirebaseToken, updateCourse)
  .delete(verifyFirebaseToken, deleteCourse);

export default router;
