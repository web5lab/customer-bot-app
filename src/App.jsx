import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { BotProvider } from './contexts/BotContext'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { BottomNavigation } from './components/BottomNavigation'
import { NotificationHandler } from './components/NotificationHandler'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

// Pages
import { Bots } from './pages/Bots'
import { Chat } from './pages/Chat'
import { Training } from './pages/Training'
import { Login } from './pages/Login'
import { Settings } from './pages/Settings'
import { Customize } from './pages/Customize'
import { Documentation } from './pages/Documentation'
import Teams from './pages/Teams'

import { logedInSelector } from './store/selectors'
import { GetUserData, GetBots } from './store/actions'

function AuthHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('authToken', token)
      dispatch(GetUserData(token))
      navigate('/')
    }
  }, [location, navigate, dispatch])

  return null
}

function AppLayout() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login'
  const isLoggedIn = useSelector(logedInSelector)
  
  // Check if we're in a chat session (not just the chat list)
  const isInChatSession = location.pathname === '/chat' && location.search.includes('session=')
  
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <NotificationHandler />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth-success" element={<AuthHandler />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Bots />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/training" element={
            <ProtectedRoute>
              <Training />
            </ProtectedRoute>
          } />
          <Route path="/customize" element={
            <ProtectedRoute requiresBot>
              <Customize />
            </ProtectedRoute>
          } />
          <Route path="/teams" element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/docs" element={<Documentation />} />
        </Routes>
      </main>
      
      {/* Bottom Navigation - Only show when logged in, not on auth pages, and not in chat session */}
      {isLoggedIn && !isAuthPage && !isInChatSession && <BottomNavigation />}
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(logedInSelector)

  useEffect(() => {
    dispatch(GetBots())
  }, [dispatch])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      dispatch(GetUserData(token))
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <AuthProvider>
        <BotProvider>
          <AppLayout />
        </BotProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}