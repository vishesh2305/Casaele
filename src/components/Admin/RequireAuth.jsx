import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function RequireAuth() {
  const location = useLocation()
  const [ready, setReady] = useState(false)
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    setHasToken(!!localStorage.getItem('authToken'))
    setReady(true)
  }, [location.pathname])

  if (!ready) return null
  if (!hasToken) return <Navigate to="/admin/login" replace />
  return <Outlet />
}


