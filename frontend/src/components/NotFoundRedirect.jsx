import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function NotFoundRedirect() {
  const { session } = useAuth()
  return <Navigate to={session ? '/home' : '/'} replace />
}

