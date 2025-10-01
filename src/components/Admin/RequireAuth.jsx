import { Navigate, Outlet } from 'react-router-dom'

export default function RequireAuth() {
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true'
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />
  return <Outlet />
}


