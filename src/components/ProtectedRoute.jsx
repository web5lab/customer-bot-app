import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { logedInSelector, activeBotSelector } from '../store/selectors'

export function ProtectedRoute({ children, requiresBot = false }) {
  const isLoggedIn = useSelector(logedInSelector)
  const activeBot = useSelector(activeBotSelector)
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiresBot && !activeBot) {
    return <Navigate to="/" replace />
  }

  return children
}