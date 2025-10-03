import { Router } from 'express'
import { verifyFirebaseToken } from '../middleware/auth.js'
import { submitForm, listForms, exportFormsExcel } from '../controllers/formsController.js'

const router = Router()

// Public submit endpoint; add verifyFirebaseToken if you want to restrict
router.post('/', submitForm)

// Admin endpoints
router.get('/', verifyFirebaseToken, listForms)
router.get('/export', verifyFirebaseToken, exportFormsExcel)

export default router


