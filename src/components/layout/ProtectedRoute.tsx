import { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/auth'
import { Role } from '@/types/api.types'

interface Props {
  allowedRoles: Role[]
  children?: ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: Props) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
