import { useNavigate, useLocation } from 'react-router-dom'
import { Bot, MessageCircle, Users, Settings, Brain } from 'lucide-react'

export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { id: 'bots', icon: Bot, label: 'Bots', path: '/' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', path: '/chat' },
    { id: 'training', icon: Brain, label: 'Training', path: '/training' },
    { id: 'teams', icon: Users, label: 'Teams', path: '/teams' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors touch-target ${
                active
                  ? 'text-gray-900 bg-gray-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}