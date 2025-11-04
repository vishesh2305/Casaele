import { Router } from 'express'
import { createUser, getFirebaseUsers, setFirebaseUserRole } from '../controllers/userController.js'
import { verifyFirebaseToken, verifyAdmin } from '../middleware/auth.js'

const router = Router()

// Existing local users (if any)
router.get('/local', getFirebaseUsers);

// Firebase users (Admin SDK) - protected
router.get('/', verifyFirebaseToken, getFirebaseUsers);
router.post('/', createUser);


router.post('/set-role', verifyFirebaseToken, verifyAdmin, setFirebaseUserRole);


export default router


