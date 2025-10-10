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

// Middleware to check if user is verified admin (for admin panel access)
export async function verifyVerifiedAdmin(req, res, next) {
  try {
    // First verify Firebase token
    await verifyFirebaseToken(req, res, () => {});

    // Check if user is super admin (bypass verification check)
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    if (req.user.email === superAdminEmail) {
      req.user.isSuperAdmin = true;
      return next();
    }

    // For regular admins, check if they exist and are verified
    const Admin = (await import('../models/Admin.js')).default;
    const admin = await Admin.findOne({ 
      email: req.user.email, 
      verified: true 
    });

    if (!admin) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin verification required. Please contact the main administrator.' 
      });
    }

    req.user.adminRole = admin.role;
    next();

  } catch (error) {
    console.error('Verified admin verification error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
}