import { Router } from 'express'
import { verifyFirebaseToken } from '../middleware/auth.js'
import { getDashboardStats, getSalesOverview } from '../controllers/dashboardController.js'

const router = Router()

// Protect all dashboard routes
router.get('/stats', verifyFirebaseToken, getDashboardStats)
router.get('/sales', verifyFirebaseToken, getSalesOverview)

export default router


