import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';

const router = express.Router();

router.route('/')
  .get(getCourses) // Make this route public
  .post(verifyFirebaseToken, createCourse);

router.route('/:id')
  .get(getCourseById) // Make this route public
  .put(verifyFirebaseToken, updateCourse)
  .delete(verifyFirebaseToken, deleteCourse);

export default router;