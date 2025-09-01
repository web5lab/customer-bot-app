import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Bell, X } from 'lucide-react'
import { notificationService } from '../services/notificationService'
import { logedInSelector } from '../store/selectors'
import toast from 'react-hot-toast'

export function NotificationHandler() {
  const navigate = useNavigate()
  const isLoggedIn = useSelector(logedInSelector)

  useEffect(() => {
    if (isLoggedIn) {
      // Initialize notification service when user is logged in
      notificationService.initialize()
    }
  }, [isLoggedIn])

  useEffect(() => {
    // Handle foreground notifications
    const handleForegroundNotification = (event) => {
      const notification = event.detail
      
      // Show toast notification
      toast.custom((t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title || 'CustomerBot'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.body || notification.notification?.body}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-center'
      })
    }

    // Handle notification tap
    const handleNotificationTap = (event) => {
      const notification = event.detail
      
      // Navigate based on notification data
      if (notification.data?.screen) {
        navigate(notification.data.screen)
      } else if (notification.data?.botId) {
        navigate(`/chat?bot=${notification.data.botId}`)
      } else {
        navigate('/chat')
      }
    }

    // Add event listeners
    window.addEventListener('foregroundNotification', handleForegroundNotification)
    window.addEventListener('notificationTap', handleNotificationTap)

    // Cleanup
    return () => {
      window.removeEventListener('foregroundNotification', handleForegroundNotification)
      window.removeEventListener('notificationTap', handleNotificationTap)
    }
  }, [navigate])

  return null // This component doesn't render anything
}