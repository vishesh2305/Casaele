import { Router } from 'express'
import { verifyFirebaseToken } from '../middleware/auth.js'
import { createCmsPage, getCmsPages, getCmsPageById, getCmsPageBySlug, updateCmsPage, deleteCmsPage } from '../controllers/cmsController.js'

const router = Router()

router.post('/', verifyFirebaseToken, createCmsPage)
router.get('/', getCmsPages) // public cms list
router.get('/:id', getCmsPageById) // public cms by id
router.put('/:id', verifyFirebaseToken, updateCmsPage)
router.delete('/:id', verifyFirebaseToken, deleteCmsPage)

// Public fetch by slug
router.get('/slug/:slug', getCmsPageBySlug)

export default router


