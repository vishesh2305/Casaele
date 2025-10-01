import { Router } from 'express'

const router = Router()

router.get('/users', (req, res) => {
  res.json([
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { name: 'Bob Lee', email: 'bob@example.com', role: 'Editor', status: 'Active' },
    { name: 'Charlie Kim', email: 'charlie@example.com', role: 'Viewer', status: 'Suspended' },
  ])
})

router.get('/products', (req, res) => {
  res.json([
    { name: 'Learning Kit', price: 49, stock: 120, category: 'Education' },
    { name: 'ELE Hoodie', price: 29, stock: 42, category: 'Merch' },
    { name: 'Sticker Pack', price: 5, stock: 300, category: 'Accessories' },
  ])
})

router.get('/orders', (req, res) => {
  res.json([
    { id: '#1001', user: 'Alice Johnson', total: 120, status: 'Paid' },
    { id: '#1002', user: 'Bob Lee', total: 49, status: 'Pending' },
    { id: '#1003', user: 'Charlie Kim', total: 29, status: 'Refunded' },
  ])
})

export default router


