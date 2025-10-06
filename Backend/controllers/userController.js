import User from '../models/User.js'
import { getAuth, initFirebaseAdmin } from '../config/firebaseAdmin.js'

export async function getUsers(req, res) {
  try {
    const users = await User.find().limit(50)
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
}

export async function createUser(req, res) {
  try {
    const { name, email } = req.body
    if (!name || !email) {
      return res.status(400).json({ message: 'name and email are required' })
    }
    const user = await User.create({ name, email })
    res.status(201).json(user)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' })
    }
    res.status(500).json({ message: 'Failed to create user' })
  }
}

// List users from Firebase Authentication (Admin SDK)
// @route   GET /api/users
// @desc    Get all users from Firebase Auth (paginated internally)
// @access  Admin (protected by verifyFirebaseToken at route level)
export async function getFirebaseUsers(req, res) {
  try {
    initFirebaseAdmin()
    const auth = getAuth()

    const allUsers = []
    let nextPageToken = undefined
    do {
      // Firebase returns up to 1000 users per page
      const result = await auth.listUsers(1000, nextPageToken)
      const mapped = result.users.map(u => ({
        uid: u.uid,
        email: u.email || '',
        name: u.displayName || '',
        photoURL: u.photoURL || '',
        phoneNumber: u.phoneNumber || '',
        providerIds: u.providerData?.map(p => p.providerId) || [],
        role: (u.customClaims && (u.customClaims.role || u.customClaims.roles)) || 'user',
        status: u.disabled ? 'Disabled' : 'Active',
        disabled: !!u.disabled,
        creationTime: u.metadata?.creationTime || '',
        lastSignInTime: u.metadata?.lastSignInTime || ''
      }))
      allUsers.push(...mapped)
      nextPageToken = result.pageToken
    } while (nextPageToken)

    return res.json(allUsers)
  } catch (err) {
    console.error('getFirebaseUsers error:', err?.message || err)
    return res.status(500).json({ message: 'Failed to fetch Firebase users' })
  }
}


