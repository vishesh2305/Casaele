import { getAuth, initFirebaseAdmin } from '../config/firebaseAdmin.js'

export async function verifyFirebaseToken(req, res, next) {
  try {
    // Dev bypass: allow local development without Firebase Admin configured
    if (process.env.DEV_AUTH_DISABLED === 'true') {
      req.user = { email: 'dev@local', role: 'admin', devBypass: true }
      return next()
    }

    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Unauthorized: missing Bearer token' })
    }
    initFirebaseAdmin()
    const decoded = await getAuth().verifyIdToken(token)

    // Normalize role from custom claims if present
    const claimsRole = decoded?.role || decoded?.roles || decoded?.customClaims?.role
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean)

    // Elevate role to admin if email is whitelisted
    const isWhitelisted = decoded?.email && adminEmails.includes(decoded.email.toLowerCase())
    req.user = { ...decoded, role: isWhitelisted ? 'admin' : (claimsRole || 'user') }
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