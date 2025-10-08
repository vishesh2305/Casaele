import { getAuth, initFirebaseAdmin } from '../config/firebaseAdmin.js'

export async function verifyFirebaseToken(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Unauthorized: missing Bearer token' })
    }
    initFirebaseAdmin()
    const decoded = await getAuth().verifyIdToken(token)
    req.user = decoded
    return next()
  } catch (err) {
    // Surface clearer diagnostics in development
    console.error('verifyFirebaseToken error:', err?.message || err)
    const message = err?.errorInfo?.message || err?.message || 'invalid token'
    return res.status(401).json({ message: `Unauthorized: ${message}` })
  }
}




export function verifyAdmin(req, res, next) {
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: requires admin privileges' });
}