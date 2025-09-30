import User from '../models/User.js'

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


