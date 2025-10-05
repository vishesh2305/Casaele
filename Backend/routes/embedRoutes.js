import express from 'express'
import { verifyFirebaseToken } from '../middleware/auth.js'
import { createEmbed, getEmbeds, updateEmbed, deleteEmbed } from '../controllers/embedController.js'

const router = express.Router()

// All routes protected by Firebase auth; optionally extend to check admin claims
router.post('/', verifyFirebaseToken, createEmbed)
router.get('/', verifyFirebaseToken, getEmbeds)
router.put('/:id', verifyFirebaseToken, updateEmbed)
router.delete('/:id', verifyFirebaseToken, deleteEmbed)

export default router


