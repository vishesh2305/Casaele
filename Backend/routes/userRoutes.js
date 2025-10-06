import { Router } from 'express'
import { getUsers, createUser, getFirebaseUsers } from '../controllers/userController.js'
import { verifyFirebaseToken } from '../middleware/auth.js'

const router = Router()

// Existing local users (if any)
router.get('/local', getUsers)

// Firebase users (Admin SDK) - protected
router.get('/', verifyFirebaseToken, getFirebaseUsers)
router.post('/', createUser)

export default router


