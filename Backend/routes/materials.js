import { Router } from 'express'
import { verifyFirebaseToken } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyFirebaseToken, (req, res) => {
  res.json([
    { title: 'Spanish A1 Basics', type: 'PDF', size: '2.3MB' },
    { title: 'Pronunciation Guide', type: 'Video', duration: '12:45' },
  ])
})

export default router


